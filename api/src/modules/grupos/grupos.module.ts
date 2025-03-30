import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { functionService } from 'src/middlewares/geralFunctions';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';
import { QueueModule } from '../Queue/queue.module';
import { contasFunctions } from '../users/functions/contas.functions';
import { AssinaturasService } from 'src/services/assinaturas.service';
import { ScheduleService } from './schedule.service';





@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
    QueueModule
  ],
  controllers: [GruposController],
  providers: [GruposService, PrismaService, AuthFunctions, functionService, contasFunctions, AssinaturasService, ScheduleService,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class GruposModule {}

