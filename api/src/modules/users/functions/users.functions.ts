import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';

@Injectable()
export class usersFunctions {
    constructor(private prisma: PrismaService,
        private readonly loginFunctions: LoginFunctions) { }

    async veriySamePerson(email, req){
        const cookies = req.cookies;
        var result = await this.loginFunctions.verifyToken(cookies.meuToken)

        if (result.email == email) return true;

        return false;
    }

    async findMyAuth (email){
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
        if (data.senha){
            var senhaenc = await this.encryptPassword(data.senha)
            data.senha = senhaenc
        }else{
            delete data.senha;
        }
        return await this.prisma.autenticacao.update({
            data,
            where: {
                idAutenticacao: Number(id)
            }
        })
    }

    async encryptPassword(password){
        var senhaenc = await bcrypt.hash(password, 10)
        return senhaenc;
    }

    async encryptCode(code){
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

    async verifyDocumentExists(document, id?) {
        if (id) {
            return await this.prisma.contas.findFirst({
                where: {
                    documento: document,
                    NOT: {
                        idConta: Number(id)
                    }
                }
            })
        } else {
            return await this.prisma.contas.findFirst({
                where: {
                    documento: document,
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

      async createAssinaturaRecrutador(){
       const retorno = await this.prisma.assinatura.create({
            data: {
                status: 'Ativo',
                qtdeFretes: 0,
                qtdeContatos: 0,
                plano: "Recrutador",
                prazo: new Date()
            }
        });

        return retorno.idAssinatura;
      }
}
