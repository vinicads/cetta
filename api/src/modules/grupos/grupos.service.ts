import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import { GrupoDTO } from './dto/grupo.dto';
import { DataDTO } from './dto/data.dto';
import { addMonths } from 'date-fns';
import { contasFunctions } from '../users/functions/contas.functions';
import path from 'path';
import * as fs from 'fs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AssinaturasService } from 'src/services/assinaturas.service';
import { AssinaturaDTO } from '../users/dto/assinatura.dto';
import { AuthFunctions } from 'src/middlewares/auth.middleware';

@Injectable()
export class GruposService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly contasFunctions: contasFunctions,
    private readonly authFunctions: AuthFunctions,
    private readonly geralFunctions: functionService,
    private readonly assinaturaService: AssinaturasService,
    @InjectQueue('geral') private readonly geralQueue: Queue
  ) {

  }

  async findAll(res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const resultadoGrupos = await this.prisma.grupoConta.findMany({
        where: {
          idConta: Number(myData.idConta)
        }
      });

      if (resultadoGrupos.length == 0) {
        return res.status(404).send("Nenhum grupo encontrado.");
      }

      const grupos = await Promise.all(resultadoGrupos.map(async (grupo) => {
        const dadosGrupo = await this.prisma.grupos.findFirst({
          where: {
            idGrupo: Number(grupo.idGrupo)
          },
          include: {
            planos: true,
            datas: true
          }
        });

        if (!dadosGrupo) {
          return null;
        }

        return dadosGrupo;
      }));

      return res.status(200).send(grupos);
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async create(grupo: GrupoDTO, datas: DataDTO[], res, req) {
    try {
      if (datas.length < 1) {
        return res.status(400).send("Cada grupo deve ter pelo menos uma sessão semanal.");
      }

      const planoExists = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(grupo.idPlanos)
        }
      });

      if (!planoExists) {
        return res.status(404).send("O plano que o grupo se encaixa não foi encontrado");
      }

      if (planoExists.maxSessoes != datas.length) {
        return res.status(400).send("A quantidade de datas para sessões enviadas não corresponde à quantidade requisitada no plano.");
      }

      for (const data of datas) {
        const dataExistente = await this.prisma.datas.findFirst({
          where: {
            dia: data.dia,
            hora: data.hora
          },
          include: {
            grupos: {
              include: {
                planos: true
              }
            }
          }
        });

        if (dataExistente && dataExistente.grupos.planos.tipoFuncionalidade == planoExists.tipoFuncionalidade) {
          return res.status(400).send(`Já existe uma sessão no dia ${data.dia} às ${data.hora}.`);
        }
      }

      grupo.dataFinal = addMonths(new Date(), planoExists.meses), 'yyyy-MM-dd';

      const grupoNovo = await this.prisma.grupos.create({
        data: grupo
      });

      for (const data of datas) {
        data.idGrupo = grupoNovo.idGrupo
        await this.prisma.datas.create({
          data
        });
      }


      return res.status(200).send("Cadastrado com sucesso.");
    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

  async update(id: number, grupo: GrupoDTO, datas: DataDTO[], res, req) {
    try {
      if (datas.length < 1) {
        return res.status(400).send("Cada grupo deve ter pelo menos uma sessão semanal.");
      }

      const planoExists = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(grupo.idPlanos)
        }
      });

      if (!planoExists) {
        return res.status(404).send("O plano que o grupo se encaixa não foi encontrado");
      }

      if (planoExists.maxSessoes != datas.length) {
        return res.status(400).send("A quantidade de datas para sessões enviadas não corresponde à quantidade requisitada no plano.");
      }

      for (const data of datas) {
        const dataExistente = await this.prisma.datas.findFirst({
          where: {
            dia: data.dia,
            hora: data.hora,
            idData: {
              not: data.idData
            }
          }
        });

        if (dataExistente) {
          return res.status(400).send(`Já existe uma sessão no dia ${data.dia} às ${data.hora}.`);
        }
      }

      const grupoNovo = await this.prisma.grupos.create({
        data: grupo
      });

      for (const data of datas) {
        await this.prisma.datas.update({
          data,
          where: {
            idData: Number(data.idData)
          }
        });
      }


      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {

      return res.status(400).send("Dados incorretos.");
    }
  }

  async delete(id, res, req) {
    try {

      const resultado = await this.prisma.grupos.findFirst({
        where: {
          idGrupo: Number(id)
        }
      });

      if (!resultado) {
        return res.status(404).send("Nenhum grupo cadastrado com esse ID")
      };

      try {
        const contasGrupo = await this.prisma.grupoConta.findMany({
          where: {
            idGrupo: Number(resultado.idGrupo)
          }
        });

        if (contasGrupo.length > 0) {
          await Promise.all(contasGrupo.map(async (conta) => {
            await this.contasFunctions.desativarAssinatura(conta.idConta, resultado.idPlanos);
          }));
        }
        await this.prisma.datas.deleteMany({
          where: {
            idGrupo: Number(resultado.idGrupo)
          }
        })
        await this.prisma.grupos.delete({
          where: {
            idGrupo: Number(id)
          }
        });

        const caminhoGrupo = path.join('grupos', id.toString());
        await this.geralFunctions.deletePath(caminhoGrupo);

        return res.status(200).send("Apagado com sucesso.");
      } catch (error) {
        console.log(error)
        return res.status(500).send("Algo deu errado ao apagar o produto.");
      }
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }

  }
  
  async findOne(idGrupo: number, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }
      const resultado = await this.prisma.grupos.findFirst({
        where: {
          idGrupo: Number(idGrupo)
        },
        include: {
          planos: true,
          datas: true
        }
      });

      if (!resultado) {
        return res.status(404).send("Nenhum grupo cadastrado com esse ID")
      };

      
      if (myData.conta.perfil == 'Usuario'){
        const membro = await this.prisma.grupoConta.findFirst({
          where: {
            idConta: Number(myData.conta.idConta),
            idGrupo: idGrupo
          }
        })

        if (!membro){
          return res.status(404).send("Você não faz parte desse grupo.");
        }
      }

      const contasGrupo = await this.prisma.grupoConta.findMany({
        where: {
          idGrupo: Number(resultado.idGrupo)
        }
      });

      let contas = [];
      if (contasGrupo.length > 0) {
        await Promise.all(contasGrupo.map(async (conta) => {
          const contaData = await this.prisma.contas.findFirst({
            where: {
              idConta: Number(conta.idConta)
            },
            include: {
              autenticacao: true
            }
          });
          if (contaData) {
            contas.push(contaData)
          }
        }
        ));
      }

      const newData = {
        ...resultado,
        contas: contas
      }

      return res.status(200).send(newData);
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async inserirUsuario(idGrupo, contasIDS: number[], res, req) {
    try {
      const resultado = await this.prisma.grupos.findFirst({
        where: {
          idGrupo: Number(idGrupo)
        }
      });

      if (!resultado) {
        return res.status(404).send("Nenhum grupo cadastrado com esse ID")
      };

      await Promise.all(contasIDS.map(async (id) => {
        let conta = await this.prisma.contas.findFirst({
          where: {
            idConta: Number(id)
          }
        });

        if (conta) {
          let autenticacao = await this.prisma.autenticacao.findFirst({
            where: {
              idConta: Number(conta.idConta)
            }
          })
          let assinatura = await this.assinaturaService.get(conta.idConta, resultado.idPlanos);
          if (assinatura) {
            await this.assinaturaService.create(conta.idConta, resultado.idPlanos, true);
          } else {
            let assinaturaDTO = new AssinaturaDTO();
            assinaturaDTO.ativo = true;
            assinaturaDTO.idAssinatura = assinatura.idAssinatura;
            assinaturaDTO.idPlanos = assinatura.idPlanos;
            await this.assinaturaService.update(assinaturaDTO);
          }

          let usuarioGrupo = await this.prisma.grupoConta.findFirst({
            where: {
              idGrupo: Number(idGrupo),
              idConta: Number(conta.idConta)
            }
          });

          if (!usuarioGrupo) {
            await this.prisma.grupoConta.create({
              data: {
                idConta: Number(conta.idConta),
                idGrupo: Number(idGrupo)
              }
            })
          }

          const jobData = {
            nome: conta.nome,
            mensagem: "Olá, informamos que você foi adicionado a um grupo, acesse o sistema para mais detalhes",
            email: autenticacao.email,
          };

          await this.geralQueue.add('novoPaciente', {
            jobData
          });
        }
      }));

      return res.status(200).send("Usuários inseridos no grupo.")
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async entrar(idGrupo: number, res, req) {
    try {

      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const resultado = await this.prisma.grupos.findFirst({
        where: {
          idGrupo: Number(idGrupo)
        }
      });

      if (!resultado) {
        return res.status(404).send("Nenhum grupo cadastrado com esse ID")
      };

      const usuarioGrupo = await this.prisma.grupoConta.findFirst({
        where: {
          idConta: myData.idConta,
          idGrupo: idGrupo
        }
      })

      if (usuarioGrupo) {
        return res.status(200).send("Você já faz parte desse grupo.");
      }

      const plano = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(resultado.idPlanos)
        }
      });

      if (!plano) {
        return res.status(404).send("Nenhum plano cadastrado com esse ID")
      }

      const assinatura = await this.assinaturaService.get(myData.idConta, resultado.idPlanos);

      if (!assinatura || assinatura.ativo == false) {
        return res.status(401).send("Você precisa ter uma assinatura ativa para esse tipo de grupo para entrar.");
      }

      const contagemGrupo = await this.prisma.grupoConta.count({
        where: {
          idGrupo: Number(idGrupo)
        }
      });

      if (contagemGrupo >= plano.qtdePessoas) {
        return res.status(401).send("O grupo selecionado não possui mais espaço.");
      }

      await this.prisma.grupoConta.create({
        data: {
          idConta: Number(myData.idConta),
          idGrupo: Number(idGrupo)
        }
      })

      return res.status(200).send("Parabéns! Agora você faz parte do grupo.");



    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async removerUsuario(idConta, idGrupo, res, req) {
    try {
      const contaExists = await this.prisma.contas.findFirst({
        where: {
          idConta: Number(idConta)
        }
      })

      if (!contaExists) {
        return res.status(404).send("Conta não encontrada");
      }


      await this.prisma.grupoConta.deleteMany({
        where: {
          idConta: Number(idConta),
          idGrupo: Number(idGrupo)
        }
      });

      const autenticacao = await this.prisma.autenticacao.findFirst({
        where: {
          idConta: Number(idConta)
        }
      })

      const jobData = {
        nome: contaExists.nome,
        mensagem: "Olá, informamos que você foi removido do seu grupo, entre em contato com nosso suporte para mais detalhes.",
        email: autenticacao.email,
      };

      await this.geralQueue.add('novoPaciente', {
        jobData
      });

      return res.status(200).send("Usuário removido do grupo com sucesso.");
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async sendFiles(idGrupo: number, arquivos, res, req) {
    try {
      const caminhoGrupo = path.join('grupos', idGrupo.toString());
      if (arquivos) {
        await this.geralFunctions.saveFiles(arquivos, caminhoGrupo);
      }

      return res.status(200).send("Arquivos enviados com sucesso.")
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async getArquivos(idGrupo, res, req) {
    try {
      if (!idGrupo) {
        return res.status(400).send("O ID do grupo deve ser enviado.");
      }
      const caminhoGrupo = path.join('grupos', idGrupo.toString());
      const arquivos = await this.geralFunctions.getFilesAndFolders(caminhoGrupo);

      if (arquivos.length == 0) {
        return res.status(404).send("Nenhum arquivo ou pasta encontrado.");
      }

      return res.status(200).send(arquivos)

    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

  async criarPasta(idGrupo: number, caminho: string[], nomePasta: string, res, req) {
    try {

      if (!idGrupo) {
        return res.status(400).send("O ID do grupo deve ser enviado.");
      }

      const caminhoGrupo = path.join('grupos', idGrupo.toString());
      const caminhoCompleto = path.join(caminhoGrupo, ...caminho, nomePasta);

      if (!fs.existsSync(caminhoCompleto)) {
        fs.mkdirSync(caminhoCompleto, { recursive: true });
        return res.status(201).send(`Pasta criada com sucesso: ${caminhoCompleto}`);
      } else {
        return res.status(400).send('A pasta já existe.');
      }
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }
  }

}

