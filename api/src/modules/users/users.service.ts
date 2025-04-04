import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { usersFunctions } from './functions/users.functions';
import { contaDTO } from './dto/conta.dto';
import { usersDTO } from './dto/users.dto';
import { contasFunctions } from './functions/contas.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { questionarioDTO } from './dto/questionario.dto';
import { AssinaturaDTO } from './dto/assinatura.dto';
import { AssinaturasService } from 'src/services/assinaturas.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private readonly usersFunctions: usersFunctions,
    private readonly loginFunctions: LoginFunctions,
    private readonly contasFunctions: contasFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,
    private readonly assinaturasService: AssinaturasService,
    @InjectQueue('geral') private readonly geralQueue: Queue) { }

  async create(data: usersDTO, conta: contaDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);

      if (conta.perfil == 'Admin') {
        if (!myData || myData.conta.perfil != 'Admin') {
          return res.status(401).send("Você não tem autorização para realizar essa ação.")
        }
      }

      var resultadoEmail = await this.usersFunctions.verifyEmailExists(data.email);

      if (resultadoEmail) {
        return res.status(403).send("E-mail já cadastrado.");
      }

      try {
        var resultadoConta = await this.contasFunctions.cadastrarConta(conta);
        data.idConta = resultadoConta.idConta;
        await this.usersFunctions.cadastroAutenticacao(data);
      } catch (error) {
        console.log(error)
        return res.status(400).send("Dados incorretos." + error);
      }

      const jobData = {
        email: data.email,
      };

      await this.geralQueue.add('sendNewConta', {
        jobData
      });

      if (!myData){
        var token = await this.loginFunctions.generateToken(data.email);
        res.cookie('meuToken', token, {
          secure: false,
          httpOnly: true,
          withCredentials: true,
          sameSite: 'lax',
          // domain: 'encontrandofretes.com',
          maxAge: Number(String(process.env.tempoCookie)),
          path: "/",
        });
      }

      return res.status(200).send("Cadastro de conta realizado.");
    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos." + error);
    }
  }


  async findAll(res, filters, start, quantity) {
    try {
      var contagem = await this.prisma.autenticacao.count({
        where: filters,
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      var data = await this.prisma.autenticacao.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
        orderBy: {
          idAutenticacao: 'asc'
        }
      });

      const dataWithAssinatura = await Promise.all(
        data.map(async (item) => {
          let retornoUsuario = await this.usersFunctions.getUserCompleteData(item.idAutenticacao);
          let assinaturas = await this.assinaturasService.getAll(item.idConta);
          let grupos = await this.prisma.grupoConta.findMany({
            where: {
              idConta: Number(item.idConta)
            }
          });

          let gruposConta = await Promise.all(
            grupos.map(async (grupo) => {
              let grupoData = await this.prisma.grupos.findFirst({
                where: {
                  idGrupo: Number(grupo.idGrupo)
                }
              });

              return {
                ...grupoData
              }
            }))
          return {
            autenticacao: retornoUsuario.autenticacao,
            conta: retornoUsuario.dadosPessoais,
            assinatura: assinaturas,
            grupo: gruposConta,
            historicoPagamento: retornoUsuario.historico,
          };
        })
      );


      if (Array.isArray(dataWithAssinatura) && dataWithAssinatura.length === 0) {
        return res.status(404).send("Nenhum usuário encontrado.");
      } else {
        var newData = {
          "usuarios": dataWithAssinatura,
          "count": contagem
        }
        return res.status(200).send(newData);
      }
    } catch (error) {
      return res.status(400).send("Nenhum usuário encontrado.");
    }
  }

  async findOne(res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const data = await this.usersFunctions.getUserCompleteData(myData.idAutenticacao);

      return res.status(200).send(data)
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  async updateAuth(email, senha, req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);

      if (email) {
        var resultado = await this.usersFunctions.verifyEmailExists(email, myData.idAutenticacao);

        if (resultado) {
          return res.status(403).send("E-mail já cadastrado.");
        }

        try {
          await this.prisma.autenticacao.update({
            where: {
              idAutenticacao: Number(myData.idAutenticacao)
            },
            data: {
              email: email
            }
          })
        } catch (error) {
          return res.status(400).send("Dados incorretos." + error);
        }

        var token = await this.loginFunctions.generateToken(email);
        res.cookie('meuToken', token, {
          secure: false,
          httpOnly: true,
          withCredentials: true,
          sameSite: 'lax',
          //domain: 'encontrandofretes.com',
          maxAge: Number(String(process.env.tempoCookie)),
          path: "/",
        })
      }

      if (senha) {
        let senhaEnc = await this.usersFunctions.encryptPassword(senha)
        try {
          await this.prisma.autenticacao.update({
            where: {
              idAutenticacao: Number(myData.idAutenticacao)
            },
            data: {
              senha: senhaEnc
            }
          })
        } catch (error) {
          return res.status(400).send("Dados incorretos." + error);
        }
      }

      return res.status(200).send("Dados atualizados.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }

  async update(id: number, data: usersDTO, conta: contaDTO, res, req) {
    try {

      var autenticacaoExists
      try {
        autenticacaoExists = await this.prisma.autenticacao.findUnique({
          where: {
            idAutenticacao: Number(id),
          }
        });


        if (!autenticacaoExists) {
          return res.status(404).send("Autenticação não encontrada.");
        }
      } catch (error) {
        return res.status(404).send("Autenticação não encontrada.");
      }

      const myData = await this.authFunctions.getMyData(req);

      if (myData.conta.perfil != 'Admin' && conta.perfil == "Admin") {
        return res.status(401).send("Você não tem autorização para realizar essa ação.")
      }

      var resultado = await this.usersFunctions.verifyEmailExists(data.email, id);

      if (resultado) {
        return res.status(403).send("E-mail já cadastrado.");
      }

      await this.contasFunctions.atualizaConta(autenticacaoExists.idConta, conta);
      await this.usersFunctions.updateAuth(id, data);

      let samePerson = await this.usersFunctions.veriySamePerson(autenticacaoExists.email, req);
      if (samePerson) {
        if (autenticacaoExists.email != data.email) {
          var token = await this.loginFunctions.generateToken(data.email);
          res.cookie('meuToken', token, {
            secure: false,
            httpOnly: true,
            withCredentials: true,
            sameSite: 'lax',
            //domain: 'encontrandofretes.com',
            maxAge: Number(String(process.env.tempoCookie)),
            path: "/",
          })
        }
      }
      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }

  async updateAssinatura(assinatura, res, req) {
    try {
      await this.assinaturasService.update(assinatura);
      return res.status(200).send("Assinatura atualizada com sucesso");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }

  async updateProfile(arquivos, id, req, res) {
    let resultado = await this.prisma.autenticacao.findFirst({
      where: {
        idConta: Number(id)
      }
    })

    if (!resultado) {
      return res.status(404).send("Não encontramos sua conta.");
    }

    var samePerson = await this.usersFunctions.veriySamePerson(resultado.email, req);
    if (samePerson) {
      const caminhoUsuarios = path.join('usuarios', String(id))
      const perfil = path.join(caminhoUsuarios, 'foto')

      if (arquivos) {
        let caminhoBanco = path.join(perfil, arquivos[0].originalname)
        await this.geralFunctions.deletePath(perfil);
        await this.geralFunctions.saveFiles(arquivos, perfil);
        await this.prisma.contas.update({
          data: {
            foto: caminhoBanco
          },
          where: {
            idConta: Number(resultado.idConta)
          }
        });
        return res.status(200).send("Imagem atualizada");
      }
    } else {
      return res.status(401).send("Não autorizado.");
    }
  }

  async delete(id: number, res, req, samePerson?) {
    try {
      var autenticacaoExists
      try {
        autenticacaoExists = await this.prisma.autenticacao.findUnique({
          where: {
            idAutenticacao: Number(id)
          },
          include: {
            conta: true
          }
        });

        if (!autenticacaoExists) {
          return res.status(404).send("Autenticação não encontrada.");
        }
      } catch (error) {
        return res.status(404).send("Autenticação não encontrada.");
      }

      if (autenticacaoExists.conta.perfil == 'Admin') {
        const admin = await this.prisma.contas.findMany({
          where: {
            perfil: 'Admin'
          }
        })

        if (admin.length <= 1) {
          return res.status(401).send("Deve haver pelo menos um ADMIN no sistema.");
        }
      }

      await this.prisma.historicoPagamento.deleteMany({
        where: {
          idConta: Number(autenticacaoExists.idConta),
        }
      })

      await this.prisma.questionario.deleteMany({
        where: {
          idQuestionario: Number(autenticacaoExists.conta.idQuestionario)
        }
      })

      await this.usersFunctions.deletaAutenticacao(id);
      await this.contasFunctions.deletaConta(autenticacaoExists.idConta)
      if (autenticacaoExists.conta.idAssinatura) {
        await this.prisma.assinatura.deleteMany({
          where: {
            idAssinatura: Number(autenticacaoExists.conta.idAssinatura)
          }
        })
      }

      if (samePerson) {
        res.cookie('meuToken', "token", {
          maxAge: 1,
          secure: false,
          httpOnly: true,
          sameSite: 'lax',
          //domain: 'encontrandofretes.com',
          withCredentials: true,
          path: "/",
        });
      }
      return res.status(200).send("Usuário apagado.");
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  }

  async postQuestionario(questionario: questionarioDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (!myData.conta.fagerstrom) {
        return res.status(401).send("Você ainda não pode responder esse questionário novamente.");
      }

      let questionarioExists
      if (myData.conta.idQuestionario) {
        questionarioExists = await this.prisma.questionario.findFirst({
          where: {
            idQuestionario: Number(myData.conta.idQuestionario)
          }
        })

        if (questionarioExists) {
          await this.prisma.questionario.update({
            where: {
              idQuestionario: Number(questionarioExists.idQuestionario)
            },
            data: questionario
          });

          await this.prisma.contas.update({
            where: {
              idConta: Number(myData.idConta)
            },
            data: {
              fagerstrom: false
            }
          })

          return res.status(200).send("Respostas do questionário atualizadas com sucesso.");
        }
      }

      const questionarioCriado = await this.prisma.questionario.create({
        data: questionario
      })

      await this.prisma.contas.update({
        where: {
          idConta: Number(myData.idConta)
        },
        data: {
          idQuestionario: questionarioCriado.idQuestionario,
          fagerstrom: false
        }
      })

      return res.status(200).send("Respostas do questionário respondidas com sucesso!");

    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async getQuestionario(res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      let questionarioExists
      if (myData.conta.idQuestionario) {
        questionarioExists = await this.prisma.questionario.findFirst({
          where: {
            idQuestionario: Number(myData.conta.idQuestionario)
          }
        })

        if (questionarioExists){
          let dataReturn = {
            questionario: questionarioExists
          }

          return res.status(200).send(dataReturn);
        }
     
      }

      if (!questionarioExists) {
        return res.status(404).send("Questionário não encontrado.");
      }

    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

