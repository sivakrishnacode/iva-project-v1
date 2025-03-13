import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*', // Vite frontend
    credentials: true, // Allow cookies if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
