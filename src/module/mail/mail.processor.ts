import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('mail_queue', {
  stalledInterval: 3600000,
  lockDuration: 300000,
  drainDelay: 60, // Đợi 60s khi hàng đợi trống mới kiểm tra lại
})
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { to, subject, template, context } = job.data;

    this.logger.log(`Đang xử lý gửi mail đến: ${to}...`);

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Gửi mail đến ${to} thành công!`);
    } catch (error) {
      this.logger.error(`Lỗi gửi mail đến ${to}: ${error.message}`);
      throw error; // BullMQ sẽ tự động retry dựa trên cấu hình
    }
  }
}
