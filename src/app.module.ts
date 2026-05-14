import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CategoryModule } from './modules/category/category.module';
import { TagsModule } from './modules/tags/tags.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    // 1. Cấu hình môi trường (Global)
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Hệ thống Schedule (Cron Job)
    ScheduleModule.forRoot(),

    // 3. Hạ tầng hệ thống (Logging, Security, Guards, Interceptors)
    CoreModule,

    // 4. Các Module nghiệp vụ (Business Logic)
    PrismaModule,
    UsersModule,
    ProfilesModule,
    RolesModule,
    AuthModule,
    MailModule,
    CategoryModule,
    TagsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
