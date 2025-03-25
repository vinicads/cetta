import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';

@Injectable()
export class AuthFunctions {
    constructor(
        private loginFunctions: LoginFunctions,
        private prisma: PrismaService) { }

    async verifyProfile(req, profile) {
        const cookies = req.cookies;
        if (cookies.meuToken) {
            const resultado = await this.loginFunctions.verifyToken(cookies.meuToken)
            if (resultado) {
                const permitido = await this.prisma.autenticacao.findFirst({
                    where: {
                        email: resultado.email
                    },
                    include: {
                        conta: true, 
                    }

                });
                if (permitido){
                    if (profile.includes(permitido.conta.perfil)) {
                        return true;
                    }
                }
            }
        }
        return false
    }

    async getMyData(req){
        const cookies = req.cookies;
        if (cookies.meuToken) {
            const resultado = await this.loginFunctions.verifyToken(cookies.meuToken)
            if (resultado) {
                const data = await this.prisma.autenticacao.findFirst({
                    where: {
                        email: resultado.email
                    },
                    include: {
                        conta: true
                    }
                });

                if (data){
                    return data;
                }
            }
        }
        return null
    }

    async sameProfile(req, id){
        const cookies = req.cookies;
        if (cookies.meuToken) {
            const resultado = await this.loginFunctions.verifyToken(cookies.meuToken)
            if (resultado) {
                const permitido = await this.prisma.autenticacao.findFirst({
                    where: {
                        email: resultado.email
                    },
                    include: {
                        conta: true, 
                    }

                });
                if (resultado.autenticacao.idAutenticacao == id){
                    return true;
                }
            }
        }
        return false
    }
}
