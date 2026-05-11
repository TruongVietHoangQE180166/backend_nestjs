import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { winstonConfig } from '../config/logger.config';
import { throttlerConfig } from '../config/throttler.config';
import { getMailConfig } from '../config/mail.config';
import { getRedisConfig } from '../config/redis.config';

import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { APP_CONSTANTS } from '../common/constants/app.constant';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getMailConfig(configService),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getRedisConfig(configService),
    }),
    // Đăng ký hàng đợi mail với cấu hình tiết kiệm command
    BullModule.registerQueue({
      name: APP_CONSTANTS.QUEUE.MAIL_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: APP_CONSTANTS.BULLMQ.REMOVE_ON_FAIL_COUNT, // Chỉ giữ lại 1000 lỗi gần nhất
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [
    WinstonModule,
    ThrottlerModule,
    MailerModule,
    BullModule,
  ],
})
export class CoreModule {}
