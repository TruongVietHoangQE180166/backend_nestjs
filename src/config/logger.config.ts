import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModuleOptions } from 'nest-winston';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // 1. Console transport
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.printf(({ timestamp, level, message, context, ms }) => {
          return `[Winston] ${timestamp} ${level} [${context || 'App'}] ${message} ${ms}`;
        }),
        format.colorize({ all: true }),
      ),
    }),
    // 2. Daily Rotate File transport (Errors)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // 3. Daily Rotate File transport (All combined)
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
