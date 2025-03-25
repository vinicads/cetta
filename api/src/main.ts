import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; 
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

 
  //ajustar as rotas de cookies no login e no service dos users e no publicRoutes, na de Get do frete
  

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization', "X-Set-Cookie"]
  });

  
  await app.listen(3000);
}

bootstrap();
