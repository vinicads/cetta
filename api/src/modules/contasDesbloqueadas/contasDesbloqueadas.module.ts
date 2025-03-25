import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { functionService } from 'src/middlewares/geralFunctions';
import { ContasDesbloqueadasController } from './contasDesbloqueadas.controller';
import { ContasDesbloqueadasService } from './contasDesbloqueadas.service';
import { QueueModule } from '../Queue/queue.module';



@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
    QueueModule,
  ],
  controllers: [ContasDesbloqueadasController],
  providers: [ContasDesbloqueadasService, PrismaService, AuthFunctions, functionService,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class ContasDesbloqueadasModule {}

