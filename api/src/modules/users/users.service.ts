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

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private readonly usersFunctions: usersFunctions,
    private readonly loginFunctions: LoginFunctions,
    private readonly contasFunctions: contasFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,
    @InjectQueue('geral') private readonly geralQueue: Queue) { }

  async create(data: usersDTO, conta: contaDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);

      if (conta.perfil == 'Admin') {
        if (!myData) {
          return res.status(401).send("Você não tem autorização para realizar essa ação.")
        }

        if (myData.conta.perfil != 'Admin') {
          return res.status(401).send("Você não tem autorização para realizar essa ação.")
        }
      }

      var resultadoEmail = await this.usersFunctions.verifyEmailExists(data.email);
      var resultadoDocumento = await this.usersFunctions.verifyDocumentExists(conta.documento);

      if (resultadoEmail) {
        return res.status(403).send("E-mail já cadastrado.");
      }

      if (resultadoDocumento) {
        return res.status(403).send("Documento já cadastrado.");
      }

      try {
        if (conta.perfil == 'Recrutador') {
          let id = await this.usersFunctions.createAssinaturaRecrutador();
          conta.idAssinatura = Number(id);
        }
        var resultadoConta = await this.contasFunctions.cadastrarConta(conta);
        data.idConta = resultadoConta.idConta;
        await this.usersFunctions.cadastroAutenticacao(data);
      } catch (error) {
        return res.status(400).send("Dados incorretos." + error);
      }

      const jobData = {
        email: data.email,
      };

      await this.geralQueue.add('sendNewConta', {
        jobData
      });
      return res.status(200).send("Cadastro de conta realizado.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }

  async findAllEmpresas(filters, start, quantity, res) {
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
        },
        include: {
          conta: true
        }
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhuma empresa encontrada.");
      } else {
        var newData = {
          "empresas": data,
          "count": contagem
        }
        return res.status(200).send(newData);
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  async findAllRecrutadores(filters, start, quantity, res) {
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
        },
        include: {
          conta: true
        }
      });


      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhum recrutador encontrada.");
      } else {
        var newData = {
          "recrutadores": data,
          "count": contagem
        }
        return res.status(200).send(newData);
      }
    } catch (error) {
      return res.status(400).send("Nenhum recrutador encontrado.");
    }
  }

  async enviarEmailGeral(filters, assinatura, conteudo, req, res){
    try {
      var data = await this.prisma.autenticacao.findMany({
        where: filters,
        orderBy: {
          idAutenticacao: 'asc'
        },
        include: {
          conta: true
        }
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Autenticação não encontrada.");
      } else {
        if (!assinatura) {
          const jobData = {
            contas: data,
            conteudo: conteudo
          };
    
          await this.geralQueue.add('enviarEmailGeral', {
            jobData
          });
          return res.status(200).send("E-mails enviados aos usuários.");
        } else {
          const filteredData = [];

          await Promise.all(data.map(async (item) => {
            if (assinatura == "Inativo"){
              if (!item.conta.idAssinatura) {
                filteredData.push(item);
                return;
              }
            }else{
              if (!item.conta.idAssinatura) {
                return;
              }
            }
          
              const assinaturaRecord = await this.prisma.assinatura.findUnique({
                where: { idAssinatura: Number(item.conta.idAssinatura) }
              });

              if (assinaturaRecord && assinaturaRecord.status === assinatura) {
                filteredData.push(item);
              }
            
          }));

          if (!filteredData && filteredData.length == 0){
            return res.status(404).send("Autenticação não encontrada.");
          }else{
            const jobData = {
              contas: filteredData,
              conteudo: conteudo
            };
      
            await this.geralQueue.add('enviarEmailGeral', {
              jobData
            });
            return res.status(200).send("E-mails enviados aos usuários.");
          }
         
        }

      }
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  }

  async findAll(res, filters, assinatura, start, quantity) {
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
        },
        include: {
          conta: true
        }
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Autenticação não encontrada.");
      } else {
        if (!assinatura) {
          var newData = {
            "usuarios": data,
            "count": contagem
          }
          return res.status(200).send(newData);
        } else {
          const filteredData = [];

          await Promise.all(data.map(async (item) => {
            if (assinatura == "Inativo"){
              if (!item.conta.idAssinatura) {
                filteredData.push(item);
                return;
              }
            }else{
              if (!item.conta.idAssinatura) {
                return;
              }
            }
          
              const assinaturaRecord = await this.prisma.assinatura.findUnique({
                where: { idAssinatura: Number(item.conta.idAssinatura) }
              });

              if (assinaturaRecord && assinaturaRecord.status === assinatura) {
                filteredData.push(item);
              }
            
          }));

          if (!filteredData && filteredData.length == 0){
            return res.status(404).send("Autenticação não encontrada.");
          }else{
            var newDataAssinatura = {
              "usuarios": filteredData,
              "count": filteredData.length
            };
            return res.status(200).send(newDataAssinatura);
          }
         
        }

      }
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  }

  async findOne(res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      let assinatura, desconto
      if (myData.conta.idAssinatura) {
        assinatura = await this.prisma.assinatura.findFirst({
          where: {
            idAssinatura: Number(myData.conta.idAssinatura)
          }
        })
      } else {
        assinatura = []
      }

      if (myData.conta.idDesconto) {
        desconto = await this.prisma.desconto.findFirst({
          where: {
            idDesconto: Number(myData.conta.idDesconto)
          }
        })
      } else {
        desconto = []
      }


      const data = {
        "conta": myData.conta,
        "desconto": desconto,
        "assinatura": assinatura,
      }

      return res.status(200).send(data)
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  async updateEmail(email, senha, req, res) {
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
          secure: true,
          httpOnly: true,
          withCredentials: true,
          sameSite: 'lax',
          domain: 'encontrandofretes.com',
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

      const myData = await this.authFunctions.getMyData(req);

      if (myData.conta.perfil != 'Admin') {
        if (conta.perfil == 'Admin') {
          return res.status(401).send("Você não tem autorização para realizar essa ação.")
        }
      }

      var resultado = await this.usersFunctions.verifyEmailExists(data.email, id);

      if (resultado) {
        return res.status(403).send("E-mail já cadastrado.");
      }

      var resultadoDocumento = await this.usersFunctions.verifyDocumentExists(conta.documento, autenticacaoExists.idConta);

      if (resultadoDocumento) {
        return res.status(403).send("Documento já cadastrado.");
      }



      await this.contasFunctions.atualizaConta(autenticacaoExists.idConta, conta);
      await this.usersFunctions.updateAuth(id, data);
      let samePerson = await this.usersFunctions.veriySamePerson(autenticacaoExists.email, req);
      if (samePerson) {
        if (autenticacaoExists.email != data.email) {
          var token = await this.loginFunctions.generateToken(data.email);
          res.cookie('meuToken', token, {
            secure: true,
            httpOnly: true,
            withCredentials: true,
            sameSite: 'lax',
            domain: 'encontrandofretes.com',
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

      if (autenticacaoExists.conta.perfil == 'Motorista') {
        await this.prisma.veiculo.deleteMany({
          where: {
            idConta: Number(autenticacaoExists.idConta),
          }
        })

        await this.prisma.contasdesbloqueadas.deleteMany({
          where: {
            idContato: Number(autenticacaoExists.idConta),
          }
        })
      } else {
        if (autenticacaoExists.conta.perfil == 'Recrutador') {
          await this.prisma.fretes.deleteMany({
            where: {
              idRecrutador: Number(autenticacaoExists.idConta)
            }
          })
        } else {
          await this.prisma.fretes.deleteMany({
            where: {
              idEmpresa: Number(autenticacaoExists.idConta)
            }
          })
        }

        await this.prisma.contasdesbloqueadas.deleteMany({
          where: {
            idEmpresa: Number(autenticacaoExists.idConta),
          }
        })
      }



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
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
          domain: 'encontrandofretes.com',
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
}

