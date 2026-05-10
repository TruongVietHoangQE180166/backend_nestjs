import { ConfigService } from '@nestjs/config';

export const getGoogleAuthConfig = (configService: ConfigService) => ({
  clientId: configService.get<string>('GOOGLE_CLIENT_ID'),
});
