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
}
