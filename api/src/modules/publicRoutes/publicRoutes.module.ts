import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { PublicRoutesController } from './publicRoutes.controller';
import { PublicRoutesService } from './publicRoutes.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
  ],
  controllers: [PublicRoutesController],
  providers: [ PrismaService, PublicRoutesService, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class PublicRoutesModule {}

