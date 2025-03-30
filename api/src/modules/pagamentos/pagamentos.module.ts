import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { functionService } from 'src/middlewares/geralFunctions';
import { PagamentosController } from './pagamentos.controller';
import { PagamentosService } from './pagamentos.service';
import { NotificationsGateway } from 'src/modules/websocket/websocket';
import { QueueModule } from '../Queue/queue.module';
import { AssinaturasService } from 'src/services/assinaturas.service';





@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
    QueueModule
  ],
  controllers: [PagamentosController],
  providers: [PagamentosService, PrismaService, AuthFunctions, functionService, NotificationsGateway, AssinaturasService,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class PagamentosModule {}

