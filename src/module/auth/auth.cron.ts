import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthRepository } from './auth.repository';

import { APP_CONSTANTS } from '../../common/constants/app.constant';

@Injectable()
export class AuthCron {
  private readonly logger = new Logger(AuthCron.name);

  constructor(private readonly authRepository: AuthRepository) {}

  // Chạy mỗi 30 phút để dọn dẹp các phiên đăng ký đã hết hạn
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCleanupExpiredSessions() {
    this.logger.log(`Đang chạy Cron Job: Dọn dẹp các phiên đăng ký đã quá hạn ${APP_CONSTANTS.AUTH.SESSION_EXPIRE_MINUTES} phút...`);
    
    try {
      const result = await this.authRepository.deleteExpiredSessions(new Date());
      if (result.count > 0) {
        this.logger.log(`Đã dọn dẹp thành công ${result.count} phiên đăng ký hết hạn.`);
      } else {
        this.logger.log('Không có phiên đăng ký nào hết hạn cần dọn dẹp.');
      }
    } catch (error) {
      this.logger.error(`Lỗi khi dọn dẹp phiên đăng ký hết hạn: ${error.message}`);
    }
  }
}
