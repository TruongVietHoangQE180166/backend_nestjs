import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthRepository } from './auth.repository';
import { getJwtConfig } from '../../config/jwt.config';
import { getGoogleAuthConfig } from '../../config/google.config';
import { OAuth2Client } from 'google-auth-library';
import { AuthCron } from './auth.cron';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtConfig(configService),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthCron,
    {
      provide: 'GOOGLE_AUTH_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getGoogleAuthConfig(configService);
        return {
          client: new OAuth2Client(config.clientId),
          clientId: config.clientId,
        };
      },
    },
  ],
  exports: [AuthService, AuthRepository, JwtModule],
})
export class AuthModule {}
