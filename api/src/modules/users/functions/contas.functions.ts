import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';

@Injectable()
export class contasFunctions {
    constructor(private prisma: PrismaService) { }
    
    async cadastrarConta(data) {
       return await this.prisma.contas.create({
        data
       })
    }

    async atualizaConta(id, data) {
        return await this.prisma.contas.update({
            data,
            where: {
                idConta: Number(id)
            }
        })
    }

    async deletaConta(id) {
        return await this.prisma.contas.delete({
            where: {
                idConta: Number(id)
            }
        })
    }

    async desativarAssinatura(idConta: number){
        const conta = await this.prisma.contas.findFirst({
            where: {
                idConta: Number(idConta)
            },
        })
        if (conta){
            await this.prisma.contas.update({
                where: {
                    idConta: Number(idConta)
                },
                data: {
                    idGrupo: null
                }
            })

            if (conta.idAssinatura){
                await this.prisma.assinatura.update({
                    where: {
                        idAssinatura: Number(conta.idAssinatura)
                    },
                    data: {
                        ativo: false,
                        codPagamento: '',
                    }
                })
            }
        }
        
    }
}
