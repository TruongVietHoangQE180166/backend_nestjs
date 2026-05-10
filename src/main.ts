import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { setupApp } from './config/app.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Set Winston as the default logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 2. Setup application middleware and global settings
  setupApp(app);

  // 3. Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger documentation is available on: http://localhost:${port}/docs`);
}

bootstrap();