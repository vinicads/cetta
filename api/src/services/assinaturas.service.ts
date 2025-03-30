import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { functionService } from 'src/middlewares/geralFunctions';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';
import { AssinaturaDTO } from 'src/modules/users/dto/assinatura.dto';
@Injectable()
export class AssinaturasService {
    constructor(private prisma: PrismaService,
        private readonly loginFunctions: LoginFunctions,
        private readonly geralFunctions: functionService,) {

    }

    async update(assinatura: AssinaturaDTO) {
        await this.prisma.assinatura.update({
            where: {
                idAssinatura: Number(assinatura.idAssinatura)
            },
            data: {
                ativo: assinatura.ativo,
                idPlanos: assinatura.idPlanos
            }
        });
    }

    async create(idConta: number, idPlanos: number, ativo: boolean) {
        return this.prisma.assinatura.create({
            data: {
                idConta: idConta,
                ativo: ativo,
                idPlanos: idPlanos,
                data_inicio: new Date()
            }
        })
    }


    async get(idConta: number, idPlanos?: number) {
        if (idPlanos) {
            return await this.prisma.assinatura.findFirst({
                where: {
                    idConta: idConta,
                    idPlanos: idPlanos
                }
            });
        } else {
            return await this.prisma.assinatura.findFirst({
                where: {
                    idConta: idConta
                }
            });
        }
    }

    async getAll(idConta: number) {
        return await this.prisma.assinatura.findMany({
            where: {
                idConta: idConta
            }
        });
    }

}