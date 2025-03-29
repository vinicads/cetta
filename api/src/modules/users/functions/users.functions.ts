import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';

@Injectable()
export class usersFunctions {
    constructor(private prisma: PrismaService,
        private readonly loginFunctions: LoginFunctions) { }

    async veriySamePerson(email, req) {
        const cookies = req.cookies;
        var result = await this.loginFunctions.verifyToken(cookies.meuToken)

        if (result.email == email) return true;

        return false;
    }

    async getUserCompleteData(idAutenticacao) {
        // Buscar autenticação junto com conta, assinatura e grupo
        const autenticacao = await this.prisma.autenticacao.findFirst({
            where: { idAutenticacao: Number(idAutenticacao) },
            include: {
                conta: {
                    include: {
                        assinatura: true,
                        grupo: true
                    }
                }
            }
        });

        if (!autenticacao || !autenticacao.conta) return null;

        const historico = await this.prisma.historicoPagamento.findMany({
            where: { idConta: Number(autenticacao.conta.idConta) },
            orderBy: { data_inicio: 'asc' }
        });

        return {
            autenticacao,
            dadosPessoais: autenticacao.conta,
            historico: historico.length > 0 ? historico : undefined
        };
    }


    async findMyAuth(email) {
        return await this.prisma.autenticacao.findFirst({
            where: {
                email
            },
            include: {
                conta: true
            }
        });
    }

    async cadastroAutenticacao(data) {
        data.senha = await this.encryptPassword(data.senha)
        return await this.prisma.autenticacao.create({
            data
        });
    }

    async updateAuth(id, data) {
        if (data.senha) {
            var senhaenc = await this.encryptPassword(data.senha)
            data.senha = senhaenc
        } else {
            delete data.senha;
        }
        return await this.prisma.autenticacao.update({
            data,
            where: {
                idAutenticacao: Number(id)
            }
        })
    }

    async encryptPassword(password) {
        var senhaenc = await bcrypt.hash(password, 10)
        return senhaenc;
    }

    async encryptCode(code) {
        var codeenc = await bcrypt.hash(code, 10)
        return codeenc;
    }

    async verifyEmailExists(email, id?) {
        if (id) {
            return await this.prisma.autenticacao.findFirst({
                where: {
                    email,
                    NOT: {
                        idAutenticacao: Number(id)
                    }
                },
                include: {
                    conta: true
                }
            })
        } else {
            return await this.prisma.autenticacao.findFirst({
                where: {
                    email
                },
                include: {
                    conta: true
                }
            })
        }
    }


    async deletaAutenticacao(id) {
        return await this.prisma.autenticacao.delete({
            where: {
                idAutenticacao: Number(id)
            }
        })
    }

    async generateCode() {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var codeLength = 6;
        var code = '';

        for (var i = 0; i < codeLength; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        return code;
    }
}
