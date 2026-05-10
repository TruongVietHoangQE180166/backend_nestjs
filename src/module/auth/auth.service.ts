import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/request/register.dto';
import { LoginDto } from './dto/request/login.dto';
import { AuthRepository } from './auth.repository';
import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { VerifyRegisterDto } from './dto/request/verify-register.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ResendCodeDto } from './dto/request/resend-code.dto';
import { ForgotPasswordDto } from './dto/request/forgot-password.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';

const SALT_ROUNDS = 10;
const CODE_EXPIRE_MINUTES = 2;
const CODE_EXPIRE_MS = CODE_EXPIRE_MINUTES * 60 * 1000; // 2 phút
const SESSION_EXPIRE_MS = 30 * 60 * 1000; // 30 phút
const TEMP_PASSWORD_EXPIRE_MINUTES = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    @InjectQueue('mail_queue') private readonly mailQueue: Queue,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.authRepository.findUserByIdentifier(dto.email);
    const existingUsername = await this.authRepository.findUserByIdentifier(dto.username);

    if (existingEmail || existingUsername) {
      const field = existingEmail?.email === dto.email ? 'Email' : 'Username';
      throw new ConflictException(`${field} đã được sử dụng`);
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    const codeExpiresAt = new Date(Date.now() + CODE_EXPIRE_MS);
    const sessionExpiresAt = new Date(Date.now() + SESSION_EXPIRE_MS);

    await this.authRepository.upsertVerification({
      email: dto.email,
      username: dto.username,
      passwordHash,
      code,
      codeExpiresAt,
      sessionExpiresAt,
    });

    await this._enqueueEmail('send_verification_email', {
      to: dto.email,
      subject: 'Xác thực đăng ký tài khoản Victeach',
      template: './verification',
      context: {
        username: dto.username,
        code: code,
        expiresIn: CODE_EXPIRE_MINUTES,
      },
    });

    return {
      message: 'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra.',
      email: dto.email,
    };
  }

  async resendCode(dto: ResendCodeDto) {
    const verification = await this.authRepository.findVerificationByEmail(dto.email);

    if (!verification) {
      throw new NotFoundException('Không tìm thấy yêu cầu đăng ký. Vui lòng đăng ký lại.');
    }

    if (new Date() > verification.sessionExpiresAt) {
      await this.authRepository.deleteVerification(dto.email);
      throw new BadRequestException('Phiên đăng ký đã hết hạn (30 phút). Vui lòng đăng ký lại từ đầu.');
    }

    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const newCodeExpiresAt = new Date(Date.now() + CODE_EXPIRE_MS);

    await this.authRepository.upsertVerification({
      ...verification,
      code: newCode,
      codeExpiresAt: newCodeExpiresAt,
    });

    await this._enqueueEmail('send_verification_email', {
      to: verification.email,
      subject: 'Xác thực đăng ký tài khoản Victeach',
      template: './verification',
      context: {
        username: verification.username,
        code: newCode,
        expiresIn: CODE_EXPIRE_MINUTES,
      },
    });

    return {
      message: 'Mã xác thực mới đã được gửi lại.',
      email: dto.email,
    };
  }

  async verifyRegister(dto: VerifyRegisterDto) {
    const verification = await this.authRepository.findVerificationByEmail(dto.email);

    if (!verification) {
      throw new NotFoundException('Không tìm thấy yêu cầu đăng ký.');
    }

    if (new Date() > verification.sessionExpiresAt) {
      await this.authRepository.deleteVerification(dto.email);
      throw new BadRequestException('Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại.');
    }

    if (verification.code !== dto.code) {
      throw new BadRequestException('Mã xác thực không chính xác.');
    }

    if (new Date() > verification.codeExpiresAt) {
      throw new BadRequestException('Mã xác thực đã hết hạn (2 phút). Vui lòng chọn "Gửi lại mã".');
    }

    const defaultRole = await this.authRepository.findRoleByName('USER');
    if (!defaultRole) {
      throw new NotFoundException('Role USER chưa được khởi tạo trong hệ thống');
    }

    const user = await this.authRepository.createUserWithProfile({
      email: verification.email,
      username: verification.username,
      passwordHash: verification.passwordHash,
      roleId: defaultRole.id,
    });

    await this.authRepository.deleteVerification(dto.email);

    return {
      message: 'Xác thực tài khoản thành công. Bây giờ bạn có thể đăng nhập.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByIdentifier(dto.identifier);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    if (user.passwordExpiresAt && new Date() > user.passwordExpiresAt) {
      // Xóa mật khẩu đã hết hạn để đảm bảo bảo mật
      await this.authRepository.updateUserPassword(user.id, null, null);
      throw new UnauthorizedException('Mật khẩu tạm thời đã hết hạn (5 phút). Vui lòng thực hiện khôi phục mật khẩu lại.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const accessToken = this._signToken(user.id, user.email, user.roleId, user.role.name);

    return plainToInstance(AuthResponseDto, {
      accessToken,
      user,
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.authRepository.findUserByIdentifier(dto.email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này.');
    }

    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + TEMP_PASSWORD_EXPIRE_MINUTES * 60 * 1000);

    await this.authRepository.updateUserPassword(user.id, passwordHash, expiresAt);

    await this._enqueueEmail('send_forgot_password_email', {
      to: user.email,
      subject: 'Khôi phục mật khẩu Victeach',
      template: './forgot-password',
      context: {
        username: user.username,
        newPassword: tempPassword,
        expiresIn: TEMP_PASSWORD_EXPIRE_MINUTES,
      },
    });

    return {
      message: 'Mật khẩu mới đã được gửi đến email của bạn.',
      email: user.email,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    // 1. Tìm user theo ID
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    // 2. Kiểm tra mật khẩu cũ
    if (!user.passwordHash) {
      throw new BadRequestException('Tài khoản này chưa được thiết lập mật khẩu.');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác.');
    }

    // 3. Mã hóa mật khẩu mới và cập nhật (xóa luôn thời hạn nếu có)
    const newPasswordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.authRepository.updateUserPassword(user.id, newPasswordHash, null);

    return {
      message: 'Thay đổi mật khẩu thành công.',
    };
  }

  private async _enqueueEmail(jobName: string, data: any) {
    try {
      await this.mailQueue.add(jobName, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
      });
    } catch (error) {
      console.error(`Lỗi khi đẩy vào hàng đợi mail (${jobName}):`, error);
    }
  }

  private _signToken(userId: string, email: string, roleId: string, role: string): string {
    return this.jwtService.sign({ sub: userId, email, roleId, role });
  }
}
