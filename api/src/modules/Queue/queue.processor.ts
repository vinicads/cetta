import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('geral')
export class QueueProcessor {
  constructor(private readonly mailService: MailService) {
    
  }

  @Process('sendMail')
  async sendEmail(job: Job<any>) {
    await this.mailService.sendEmailPassword(job);
  }

  @Process('sendNewConta')
  async sendNewConta(job: Job<any>) {
    await this.mailService.sendNewConta(job);
  }

  @Process('sendMedico')
  async sendMedico(job: Job<any>) {
    await this.mailService.sendMedico(job);
  }

  @Process('novoPaciente')
  async novoPaciente(job: Job<any>) {
    await this.mailService.novoPaciente(job);
  }

  @Process('pagamento')
  async pagamento(job: Job<any>) {
    await this.mailService.pagamento(job);
  }

  @Process('sendFiles')
  async sendFiles(job: Job<any>) {
    await this.mailService.sendFiles(job);
  }

}
