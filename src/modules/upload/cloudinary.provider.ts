import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { getCloudinaryConfig } from '../../config/cloudinary.config';

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    const config = getCloudinaryConfig(configService);
    return cloudinary.config(config.connection);
  },
  inject: [ConfigService],
};
