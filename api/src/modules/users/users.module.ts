import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersFunctions } from './functions/users.functions';
import { contasFunctions } from './functions/contas.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import { QueueModule } from '../Queue/queue.module';
import { AssinaturasService } from 'src/services/assinaturas.service';





@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
    QueueModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, usersFunctions, AuthFunctions, contasFunctions, functionService, AssinaturasService,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class UsersModule {}

