import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const getMailConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
    port: parseInt(configService.get<string>('MAIL_PORT') || '587'),
    secure: configService.get<string>('MAIL_PORT') === '465',
    auth: {
      user: configService.get<string>('MAIL_USER'),
      pass: configService.get<string>('MAIL_PASS'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  defaults: {
    from: `"Victeach Support" <${configService.get<string>('MAIL_USER')}>`,
  },
  template: {
    dir: join(process.cwd(), 'src', 'common', 'templates', 'email'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
