import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { NotEmptyPipe } from '../pipes/not-empty.pipe';

export function setupApp(app: INestApplication): void {
  // 1. Security Header with Helmet
  app.use(helmet());

  // 2. CORS Configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Global Prefix
  app.setGlobalPrefix('api');

  // 4. Global Pipes
  app.useGlobalPipes(new NotEmptyPipe()); // Level 1: Block empty body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Global Interceptors (that don't need DI)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}
