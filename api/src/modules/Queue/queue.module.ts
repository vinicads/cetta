import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service'; 
import { QueueProcessor } from './queue.processor';
import { functionService } from 'src/middlewares/geralFunctions';
import { PrismaService } from 'src/database/PrismaService';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'geral',
    }),
  ],
  providers: [MailService, QueueProcessor, functionService, PrismaService],
  exports: [MailService, BullModule],
})
export class QueueModule {}