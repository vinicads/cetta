import { Module } from '@nestjs/common';
import { NotificationsGateway } from './websocket';
import { AuthFunctions } from '../../middlewares/auth.middleware';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
          secret: process.env.secret,
          signOptions: { expiresIn: process.env.tempoToken },
        }),
      ],
  providers: [NotificationsGateway, AuthFunctions, LoginFunctions, PrismaService], 
})
export class WebSocketsModule {}
