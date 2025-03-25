import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as fs from 'fs-extra';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { PrismaService } from 'src/database/PrismaService';
import axios from 'axios';
import * as geolib from 'geolib';
import { addMonths, differenceInMonths, getMonth } from 'date-fns';

@Injectable()
export class MailService {
    constructor(
        private readonly geralFunctions: functionService,
        private prisma: PrismaService) {
    }


    async sendFiles(job): Promise<void> {
        let jobdata = job.data.jobdata;
        const { arquivos, caminho } = jobdata;

        if (arquivos) {
            await this.geralFunctions.saveFiles(arquivos, caminho);
        }

    }

    async verificarAssinatura(job): Promise<void> {
        let jobdata = job.data.jobData;

        const { email } = jobdata;
        const autenticacao = await this.prisma.autenticacao.findFirst({
            where: {
                email: email
            }
        });

        const conta = await this.prisma.contas.findFirst({
            where: {
                idConta: Number(autenticacao.idConta)
            }
        });

        if (conta.idAssinatura) {
            const assinatura = await this.prisma.assinatura.findFirst({
                where: {
                    idAssinatura: Number(conta.idAssinatura)
                }
            });

            const diffInMonths = differenceInMonths(new Date(), assinatura.ultimoMes);

            const currentDate = new Date();
            const prazoDate = new Date(assinatura.prazo);
            if (currentDate >= prazoDate) {
                if (assinatura.status == 'Ativo') {
                    await this.prisma.assinatura.update({
                        where: { idAssinatura: assinatura.idAssinatura },
                        data: { status: 'Inativo' }
                    });
                }

            } else {
                if (diffInMonths >= 1) {
                    const novoPlano = await this.prisma.planos.findFirst({
                        where: { nome: assinatura.plano }
                    });
                    if (novoPlano) {
                        let novosFretes = Number(novoPlano.qtdeFrete) + Number(assinatura.qtdeFretes)
                        let novosContatos = Number(novoPlano.qtdeContatos) + Number(assinatura.qtdeContatos)
                        if (assinatura.status == 'Ativo') {
                            await this.prisma.assinatura.update({
                                where: { idAssinatura: assinatura.idAssinatura },
                                data: {
                                    qtdeFretes: novosFretes,
                                    qtdeContatos: novosContatos,
                                    ultimoMes: new Date()
                                }
                            });
                        }
                    } else {
                        const plano = await this.prisma.planos.findFirst();
                        let novosFretes = Number(plano.qtdeFrete) + Number(assinatura.qtdeFretes)
                        let novosContatos = Number(plano.qtdeContatos) + Number(assinatura.qtdeContatos)
                        if (assinatura.status == 'Ativo') {
                            await this.prisma.assinatura.update({
                                where: { idAssinatura: assinatura.idAssinatura },
                                data: {
                                    qtdeFretes: novosFretes,
                                    qtdeContatos: novosContatos,
                                    ultimoMes: new Date()
                                }
                            });
                        }
                    }
                }
            }

        }
    }

    async desbloquearContatos(job): Promise<void> {
        try {
            let jobdata = job.data.jobData;
            const { empresa, contas, quantidade } = jobdata;
            const responseEmpresa = await this.getCEP(empresa.conta.cep);
            const latEmpresa = responseEmpresa.data.lat;
            const lonEmpresa = responseEmpresa.data.lng;

            let contasComDistanciaPromises = [];

            for (const conta of contas) {
                const responseContaPromise = this.getCEP(conta.cep)
                    .then(responseConta => {
                        const latConta = responseConta.data.lat;
                        const lonConta = responseConta.data.lng;
                        const distancia = this.calcularDistancia(Number(latEmpresa), Number(lonEmpresa), Number(latConta), Number(lonConta));
                        return {
                            conta,
                            distancia
                        };
                    })
                    .catch(error => {
                        console.log(`Erro ao obter dados de localização para a conta com CEP ${conta.cep}`);
                        return null;
                    });
                contasComDistanciaPromises.push(responseContaPromise);
            }

            const contasComDistancia = await Promise.all(contasComDistanciaPromises);


            const contasComDistanciaFiltradas = contasComDistancia.filter(conta => conta !== null);
            contasComDistanciaFiltradas.sort((a, b) => a.distancia - b.distancia);
            const contasAceitas = contasComDistanciaFiltradas.slice(0, Number(quantidade));
            let quantidadeContas = contasAceitas.length;
            for (const conta of contasAceitas) {
                await this.prisma.contasdesbloqueadas.create({
                    data: {
                        idEmpresa: empresa.idConta,
                        idContato: conta.conta.idConta
                    }
                })
            }
            let assinatura = await this.prisma.assinatura.findFirst({
                where: {
                    idAssinatura: Number(empresa.conta.idAssinatura)
                }
            })
            let novaQuantidade = Number(assinatura.qtdeContatos) - Number(quantidadeContas)
            await this.prisma.assinatura.update({
                data: {
                    qtdeContatos: Number(novaQuantidade)
                },
                where: {
                    idAssinatura: Number(assinatura.idAssinatura)
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    async getCEP(cep) {
        try {
            const resposta = await axios.get(`${process.env.apiCEP}/${cep}`);
            return resposta;
        } catch (error) {
            return null;
        }
    }

    calcularDistancia(lat1, lon1, lat2, lon2) {
        const distancia = geolib.getDistance(
            { latitude: lat1, longitude: lon1 },
            { latitude: lat2, longitude: lon2 }
        );
        const distanciaEmKm = distancia / 1000;
        return distanciaEmKm;
    }

    async enviarEmailGeral(job): Promise<void> {
    let jobData = job.data.jobData;
    const { contas, conteudo } = jobData;
    const transporter = nodemailer.createTransport(
        smtpTransport({
            host: "smtp.hostinger.com",
            secure: true,
            secureConnection: false,
            requireTLS: true,
            port: 465,
            debug: true,
            connectionTimeout: 10000,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    );

    const sendMailToAccount = async (conta) => {
        const mailOptions = {
            from: `"Encontrando Fretes" <${process.env.SMTP_USER}>`,
            to: conta.email,
            subject: 'Assunto importante',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mensagem Importante</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Olá, ${conta.conta.nome}</h1>
                    <p>${conteudo}</p>
                    <div class="footer">
                        <p>© 2024 Encontrando Fretes. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(`Erro ao enviar email para ${conta.email}:`, error);
        }
    };

    const promises = contas.map(conta => sendMailToAccount(conta));
    await Promise.all(promises);
}


    async sendEmail(job): Promise<void> {

        let jobData = job.data.jobData
        const { email, codigo } = jobData;
        const transporter = nodemailer.createTransport(
            smtpTransport({
                host: "smtp.hostinger.com",
                secure: true,
                secureConnection: false,
                requireTLS: true,
                port: 465,
                debug: true,
                connectionTimeout: 10000,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
        );

        const mailOptions = {
            from: `"Encontrando Fretes" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Redefinição de senha',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Redefinição de Senha</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2E86C1;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Redefinição de Senha</h1>
                    <p>Olá,</p>
                    <p>Você solicitou a redefinição de sua senha. Use o código abaixo para redefinir sua senha:</p>
                    <div class="code">${codigo}</div>
                    <p>Se você não solicitou essa alteração, por favor ignore este email.</p>
                    <p>Atenciosamente,<br>
                    Equipe de Suporte</p>
                    <div class="footer">
                        <p>© 2024 Encontrando Fretes. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `,
        };


        try {
            const info = await transporter.sendMail(mailOptions);
            return;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    async sendNewConta(job): Promise<void> {

        let jobData = job.data.jobData
        const { email } = jobData;
        const transporter = nodemailer.createTransport(
            smtpTransport({
                host: "smtp.hostinger.com",
                secure: true,
                secureConnection: false,
                requireTLS: true,
                port: 465,
                debug: true,
                connectionTimeout: 10000,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
        );

        const mailOptions = {
            from: `"Encontrando Fretes" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Cadastro de conta',
            html: `
          <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cadastro Bem-Sucedido</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
        .website-link {
            color: #2E86C1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Cadastro Bem-Sucedido</h1>
        <p>Olá,</p>
        <p>Estamos felizes em informar que seu cadastro foi realizado com sucesso.</p>
        <p>Agora você pode acessar nossa plataforma e começar a utilizar nossos serviços. Visite nosso site: <a href="https://encontrandofretes.com" class="website-link">Encontrando Fretes</a>.</p>
        <p>Se você tiver qualquer dúvida ou precisar de assistência, por favor entre em contato com nossa equipe de suporte.</p>
        <p>Atenciosamente,<br>
        Equipe de Suporte</p>
        <div class="footer">
            <p>© 2024 Encontrando Fretes. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

        `,
        };


        try {
            const info = await transporter.sendMail(mailOptions);
            return;
        } catch (error) {
            console.log(error)
            return;
        }
    }
}
