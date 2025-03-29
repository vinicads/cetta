import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogadoMiddleware } from './middlewares/logado.middleware';
import { JwtModule } from '@nestjs/jwt';
import { LoginModule } from './modules/login/login.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { BullModule } from '@nestjs/bull';
import { InfoGeralModule } from './modules/geralInfo/infoGeral.module';
import { UsersController } from './modules/users/users.controller';
import { PlanosModule } from './modules/planos/planos.module';
import { InfoGeralController } from './modules/geralInfo/infoGeral.controller';
import { PlanosController } from './modules/planos/planos.controller';
import { PublicRoutesModule } from './modules/publicRoutes/publicRoutes.module';
import { PagamentosModule } from './modules/pagamentos/pagamentos.module';
import { WebSocketsModule } from './modules/websocket/webSocket.module';
import { GruposModule } from './modules/grupos/grupos.module';
import { GruposController } from './modules/grupos/grupos.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: Number(process.env.tempoToken) },
    }),
    MulterModule.register({
      dest: './uploads/temp',
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    LoginModule, 
    UsersModule, 
    InfoGeralModule, 
    PlanosModule,
    PublicRoutesModule,
    PagamentosModule,
    GruposModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    WebSocketsModule
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogadoMiddleware)
      .exclude(
        'login/(.*)',
      )
      .forRoutes(
        InfoGeralController,
        PlanosController,
        GruposController,
      )
  }
}
