import { Injectable, Res } from '@nestjs/common';
import { LoginFunctions } from './functions/login.functions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { usersFunctions } from '../users/functions/users.functions';
import { loginDTO } from './dto/login.dto';
import { PrismaService } from 'src/database/PrismaService';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersFunctions: usersFunctions,
    private readonly loginFunctions: LoginFunctions,
    private jwt: JwtService,
    private prisma: PrismaService,
    @InjectQueue('geral') private readonly geralQueue: Queue) { }

  async verify(data: loginDTO, res, req) {
    const cookies = req.cookies;
    if (cookies.meuToken) {
      res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: true,
        sameSite: 'lax',
        domain: 'encontrandofretes.com',
        httpOnly: true,
        withCredentials: true,
        path: "/",
      });
      return res.status(400).send("Você já está logado.")
    } else {
      try {
        var resultado = await this.usersFunctions.verifyEmailExists(data.email);
        if (resultado) {
          try {
            var token = await this.loginFunctions.generateToken(data.email);
            const senhaValida = await bcrypt.compare(data.senha, resultado.senha);
            
            if (senhaValida) {
              const cookieAccepted = cookies.cookieAccepted ? true : false;
              
              let assinatura
              if (resultado.conta.idAssinatura){
                assinatura = await this.prisma.assinatura.findFirst({
                  where: {
                    idAssinatura: Number(resultado.conta.idAssinatura)
                  }
                })
              }

              const dados = {
                autenticacao: resultado,
                dadosPessoais: resultado.conta,
                perfil: resultado.conta.perfil,
                assinatura: assinatura,
                cookieAccepted: cookieAccepted
              };
        
              res.cookie('meuToken', token, {
                secure: true,
                httpOnly: true,
                withCredentials: true,
                sameSite: 'lax',
                domain: 'encontrandofretes.com',
                maxAge: Number(String(process.env.tempoCookie)),
                path: "/",
              });
        
              const jobData = {
                email: data.email,
              };
        
              await this.geralQueue.add('verificarAssinatura', {
                jobData
              });
        
              return res.status(200).send(dados);
            } else {
              return res.status(401).send('Senha invalida.');
            }
          } catch (err) {
            console.error('Erro ao processar login:', err);
            return res.status(500).send('Erro interno do servidor.');
          }
        } else {
          return res.status(404).send("E-mail não encontrado.");
        }
      } catch (error) {
        return res.status(400).send("Dados incorretos." + error);
      }
    }
  }

async cookieAccepted(req, res){
  res.cookie('cookieAccepted', "true", {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    domain: 'encontrandofretes.com',
    withCredentials: true,
    path: "/",
  });
    return res.status(200).send(true);
}

  async find(req, res) {
    const cookies = req.cookies;
    if (cookies.cookieAccepted){
      var cookieAccepted = true;
    }else{
      var cookieAccepted = false;
    }
    if (cookies.meuToken) {
      const resultado = await this.loginFunctions.verifyToken(cookies.meuToken);
      if (resultado){
        var newResultado = await this.usersFunctions.verifyEmailExists(resultado.email);
        let assinatura
        if (newResultado.conta.idAssinatura){
          assinatura = await this.prisma.assinatura.findFirst({
            where: {
              idAssinatura: Number(newResultado.conta.idAssinatura)
            }
          })
        }
        if(newResultado){
  
          const newDados= {
            "autenticacao": newResultado,
            "dadosPessoais": newResultado.conta,
            "perfil": newResultado.conta.perfil,
            "assinatura": assinatura,
            "cookieAccepted": cookieAccepted
          };
          const jobData = {
            email: newResultado.email,
        };
        this.geralQueue.add('verificarAssinatura', {
          jobData
         });
            return res.status(200).send(newDados);
        }else{
          return res.cookie('meuToken', "token", {
            maxAge: 1,
            secure: true,
            httpOnly: true,
            sameSite: 'lax',
            domain: 'encontrandofretes.com',
            withCredentials: true,
            path: "/",
          }).status(400).send("Token invalido.");
        }
        
      }else {
         res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        domain: 'encontrandofretes.com',
        withCredentials: true,
        path: "/",
      });
      var dados = {
        "message": "Token inválido.",
        "cookieAccepted": cookieAccepted,
      }
        return res.status(401).send(dados)
      }
    } else {
      var dados = {
        "message": "Primeiro faça login",
        "cookieAccepted": cookieAccepted,
      }
      return res.status(401).send(dados);
    }

  }

  async logout(req, res) {
    const cookies = req.cookies;
    if (cookies.meuToken) {
      res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: true,
        sameSite: 'lax',
        domain: 'encontrandofretes.com',
        httpOnly: true,
        withCredentials: true,
        path: "/",
      });
    }
    return res.status(200).send('Saiu com sucesso!');
  }

 
async forgotPassword(email, req, res){
  try {
    let resultado = await this.usersFunctions.verifyEmailExists(email);

  if (!resultado){
    return res.status(404).send("E-mail não encontrado no sistema.")
  }

  
  let code = await this.usersFunctions.generateCode();

  try {
    const jobData = {
      email: email,
      codigo: code, 
  };
  this.geralQueue.add('sendMail', {
    jobData
   });
  
  } catch (error) {
    console.log(error)
  }


  let codeEncrypt =  await this.usersFunctions.encryptCode(code)
  let token = await this.loginFunctions.generateTokenCode(codeEncrypt, email);
  res.cookie('secureCode', token, {
    secure: true,
    httpOnly: true,
    withCredentials: true,
    sameSite: 'lax',
    domain: 'encontrandofretes.com',
    maxAge: 30 * 60 * 1000,
    path: "/",
  })
  return res.status(200).send("Enviado.")
  } catch (error) {
    console.log(error)
    return res.status(500).send("Algo deu errado ao enviar o seu código, tente novamente mais tarde.")
  }  
}

async changePassword(dados, code, req, res){
  let cookie = req.cookies;

  if(!cookie.secureCode){
    return res.status(404).send("Nenhum código de segurança encontrado.")
  }

  const token = this.jwt.verify(cookie.secureCode);
  let secureCode = token.code;
  let email = token.email;
  const self = this;

  bcrypt.compare(code, secureCode, async function (err, result) {
    if (result) {
      let resultado = await self.usersFunctions.verifyEmailExists(dados.email);
      if (!resultado){
        return res.status(404).send("E-mail não encontrado no sistema.")
      }
      let senhaEnc = await self.usersFunctions.encryptPassword(dados.senha);
      await self.prisma.autenticacao.updateMany({
        data: {
          senha: senhaEnc
        },
        where: {
          email: email
        }
      })
      res.cookie('secureCode', "code", {
        maxAge: 1,
        secure: true,
        sameSite: 'lax',
        domain: 'encontrandofretes.com',
        httpOnly: true,
        withCredentials: true,
        path: "/",
      });
      return res.status(200).send("Senha atualizada.")
    } else {
      return res.status(401).send('Código invalido.');
    }
  })

}

async verifyCode(code, req, res){
  let cookie = req.cookies;
  if(!cookie.secureCode){
    return res.status(404).send("Nenhum código de segurança encontrado.")
  }

  const token = this.jwt.verify(cookie.secureCode);
  let secureCode = token.code;
  let email = token.email;
  const self = this;

  bcrypt.compare(code, secureCode, async function (err, result) {
    if (result) {
      return res.status(200).send("Tudo certo")
    } else {
      return res.status(401).send('Código inválido.');
    }
  })

}

}

