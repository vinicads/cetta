import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { functionService } from 'src/middlewares/geralFunctions';
import { AssinaturasService } from 'src/services/assinaturas.service';
import { contasFunctions } from '../users/functions/contas.functions';
@Injectable()
export class ScheduleService {

  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly contasFunctions: contasFunctions,
    private readonly authFunctions: AuthFunctions,
    private readonly geralFunctions: functionService,
    private readonly assinaturaService: AssinaturasService,
  ) {

  }
  @Cron('0 6 * * *')
  async handleCron() {
    const grupos = await this.prisma.grupos.findMany({
      where: {
        dataFinal: {
          lte: new Date(),
        },
      },
    });

    if (grupos.length > 0) {
      await Promise.all(grupos.map(async (grupo) => {
        const contas = await this.prisma.grupoConta.findMany({
          where: {
            idGrupo: grupo.idGrupo,
          },
        });

        if (contas.length > 0) {
          await Promise.all(contas.map(async (conta) => {
            const assinatura = await this.assinaturaService.get(conta.idConta, grupo.idPlanos);
            if (assinatura) {
              await this.contasFunctions.desativarAssinatura(assinatura.idConta, assinatura.idPlanos);
            }
          }));

          await this.prisma.grupoConta.deleteMany({
            where: {
              idGrupo: grupo.idGrupo,
            },
          });
        }

        await this.prisma.datas.deleteMany({
          where: {
            idGrupo: grupo.idGrupo,
          },
        })

        await this.prisma.grupos.delete({
          where: {
            idGrupo: grupo.idGrupo,
          },
        });
      }));
    }

  }
}
