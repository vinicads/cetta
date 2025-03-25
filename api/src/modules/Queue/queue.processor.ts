import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('geral')
export class QueueProcessor {
  constructor(private readonly mailService: MailService) {
    
  }

  @Process('sendMail')
  async sendEmail(job: Job<any>) {
    await this.mailService.sendEmail(job);
  }

  @Process('enviarEmailGeral')
  async enviarEmailGeral(job: Job<any>) {
    await this.mailService.enviarEmailGeral(job);
  }

  @Process('sendNewConta')
  async sendNewConta(job: Job<any>) {
    await this.mailService.sendNewConta(job);
  }

  @Process('sendFiles')
  async sendFiles(job: Job<any>) {
    await this.mailService.sendFiles(job);
  }

  @Process('desbloquearContatos')
  async desbloquearContatos(job: Job<any>) {
    await this.mailService.desbloquearContatos(job);
  }

  @Process('verificarAssinatura')
  async cadastrarPlanos(job: Job<any>) {
    await this.mailService.verificarAssinatura(job);
  }
}
