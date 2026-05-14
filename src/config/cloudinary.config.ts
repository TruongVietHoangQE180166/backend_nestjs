import { ConfigService } from '@nestjs/config';

export const CLOUDINARY_DEFAULTS = {
  folder: 'hoang_backend/uploads',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  fileTypeRegex: /(jpg|jpeg|png|webp)$/,
};

export const getCloudinaryConfig = (configService: ConfigService) => {
  const cloudinaryUrl = configService.get<string>('CLOUDINARY_URL');

  return {
    connection: {
      cloudinary_url: cloudinaryUrl,
    },
    upload: CLOUDINARY_DEFAULTS,
  };
};
