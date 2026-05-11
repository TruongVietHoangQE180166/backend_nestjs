import { Controller, Post, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.dto';
import { LoginDto } from './dto/request/login.dto';
import { GoogleLoginDto } from './dto/request/google-login.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { VerifyRegisterDto } from './dto/request/verify-register.dto';
import { ResendCodeDto } from './dto/request/resend-code.dto';
import { ForgotPasswordDto } from './dto/request/forgot-password.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản (Gửi mã xác thực qua email)' })
  @ApiSuccessResponse(Object, false, 'Yêu cầu đăng ký đã được gửi, vui lòng kiểm tra email')
  @ApiErrorResponses({ badRequest: true, resource: 'User', path: '/auth/register' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi lại mã xác thực' })
  @ApiSuccessResponse(Object, false, 'Mã xác thực mới đã được gửi')
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'User', path: '/auth/resend-code' })
  resendCode(@Body() resendDto: ResendCodeDto) {
    return this.authService.resendCode(resendDto);
  }

  @Public()
  @Post('verify-register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực mã code 8 chữ số để tạo tài khoản' })
  @ApiSuccessResponse(Object, false, 'Xác thực đăng ký thành công')
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'User', path: '/auth/verify-register' })
  verifyRegister(@Body() verifyDto: VerifyRegisterDto) {
    return this.authService.verifyRegister(verifyDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quên mật khẩu (Gửi mật khẩu mới qua email)' })
  @ApiSuccessResponse(Object, false, 'Mật khẩu mới đã được gửi tới email của bạn')
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'User', path: '/auth/forgot-password' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiSuccessResponse(AuthResponseDto, false, 'Đăng nhập thành công')
  @ApiErrorResponses({ badRequest: true, resource: 'User', path: '/auth/login' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập bằng Google' })
  @ApiSuccessResponse(AuthResponseDto, false, 'Đăng nhập bằng Google thành công')
  @ApiErrorResponses({ badRequest: true, resource: 'User', path: '/auth/google-login' })
  googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thay đổi mật khẩu (Yêu cầu đăng nhập)' })
  @ApiSuccessResponse(Object, false, 'Thay đổi mật khẩu thành công')
  @ApiErrorResponses({ badRequest: true, unauthorized: true, resource: 'User', path: '/auth/change-password' })
  changePassword(
    @GetCurrentUserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, changePasswordDto);
  }
}
