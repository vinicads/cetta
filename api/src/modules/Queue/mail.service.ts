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

    async sendEmailPassword(job): Promise<void> {

        let jobData = job.data.jobData
        const { email, codigo } = jobData;
        let html = `
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
                        <p>© CETTA. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `

        this.sendEmail(email, html)
    }

    async novoPaciente(job){
        let jobData = job.data.jobData
        const { nome, mensagem, email } = jobData;
      
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Novo paciente</title>
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
                    <h1>Novo grupo!</h1>
                    <p>Olá, ${nome}</p>
                    <p>${mensagem}</p>
                    <p>Atenciosamente,<br>
                    Equipe de Suporte</p>
                    <div class="footer">
                        <p>© CETTA. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `

        this.sendEmail(email, html);
    }

    async pagamento(job){
        let jobData = job.data.jobData
        const { mensagem, email, nomePlano, valorTotal } = jobData;

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Novo paciente</title>
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
                <h1>Atualização sobre a compra da assinatura</h1>
                <p>Olá!</p>
                <p>${mensagem}</p>
                <p>Informações da assinatura</p>
                <p>Nome: ${nomePlano}</p>
                <p>Valor: ${this.geralFunctions.formatarEmReais(valorTotal)}</p>
                <p>Atenciosamente,<br>
                Equipe de Suporte</p>
                <div class="footer">
                    <p>© CETTA. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        
    `

    this.sendEmail(email, html);
    }

    async sendMedico(job) {
        let jobData = job.data.jobData
        const { nome, telefone, email } = jobData;
        const infoGeral = await this.prisma.geral.findFirst();
        if (!infoGeral || !infoGeral.emailMedico){
            return;
        }
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Novo paciente</title>
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
                    <h1>Novo paciente!</h1>
                    <p>Olá,</p>
                    <p>Um novo paciente entrou em um grupo, entre em contato com ele para marcar o atendimento.</p>
                    <p>Nome: ${nome}</p>
                    <p>Telefone: ${this.geralFunctions.phoneMask(telefone)}</p>
                    <p>E-mail: ${email}</p>
                    <p>Atenciosamente,<br>
                    Equipe de Suporte</p>
                    <div class="footer">
                        <p>© CETTA. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `

        this.sendEmail(infoGeral.emailMedico, html)
    }

    async sendNewConta(job): Promise<void> {

        let jobData = job.data.jobData
        const { email } = jobData;
        let html = `
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
        <p>Agora você pode acessar nossa plataforma e começar a utilizar nossos serviços. Visite nosso site: <a href="https://cetta.com" class="website-link">CETTA</a>.</p>
        <p>Se você tiver qualquer dúvida ou precisar de assistência, por favor entre em contato com nossa equipe de suporte.</p>
        <p>Atenciosamente,<br>
        Equipe de Suporte</p>
        <div class="footer">
            <p>© CETTA. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

        `
        await this.sendEmail(email, html)
    }

    async sendEmail(to: string, html: string) {
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
            to: to,
            subject: 'Redefinição de senha',
            html: html,
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
