import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

const logger = new Logger('RedisConfig');

export const getRedisConfig = (configService: ConfigService): BullRootModuleOptions => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (redisUrl) {
    logger.log('Đang kết nối tới Redis Online qua URL...');
    return {
      connection: {
        url: redisUrl,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
        maxRetriesPerRequest: null, // Bắt buộc cho BullMQ
        enableReadyCheck: false,    // Tắt kiểm tra sẵn sàng để đỡ tốn command
      },
    };
  }

  logger.warn('KHÔNG tìm thấy REDIS_URL trong .env, đang fallback về localhost:6379');
  return {
    connection: {
      host: configService.get<string>('REDIS_HOST') || 'localhost',
      port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
  };
};
