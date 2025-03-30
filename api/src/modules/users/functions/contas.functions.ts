import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';

@Injectable()
export class contasFunctions {
    constructor(private prisma: PrismaService) { }
    
    async cadastrarConta(data) {
        data.data_nasc = new Date(data.data_nasc);
       return await this.prisma.contas.create({
        data
       })
    }

    async atualizaConta(id, data) {
        if (data.data_nasc){
            data.data_nasc = new Date(data.data_nasc);
        }
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

    async desativarAssinatura(idConta: number, idPlanos: number){
        const conta = await this.prisma.contas.findFirst({
            where: {
                idConta: Number(idConta)
            },
        })

        const grupo = await this.prisma.grupos.findFirst({
            where: {
                idPlanos: Number(idPlanos)
            }
        })
        if (conta){
            await this.prisma.grupoConta.deleteMany({
                where: {
                    idConta: Number(idConta),
                    idGrupo: Number(grupo.idGrupo)
                }
            })

                await this.prisma.assinatura.updateMany({
                    where: {
                        idConta: Number(conta.idConta),
                        idPlanos: Number(idPlanos)
                    },
                    data: {
                        ativo: false,
                        codPagamento: '',
                    }
                })
            }
        
    }
}
