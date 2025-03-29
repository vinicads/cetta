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

@Injectable()
export class GruposService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly contasFunctions: contasFunctions,
    private readonly geralFunctions: functionService,
    @InjectQueue('geral') private readonly geralQueue: Queue
  ) {

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
          }
        });

        if (dataExistente) {
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
        const contasGrupo = await this.prisma.contas.findMany({
          where: {
            idGrupo: Number(resultado.idGrupo)
          }
        });

        if (contasGrupo.length > 0) {
          await Promise.all(contasGrupo.map(async (conta) => {
            await this.contasFunctions.desativarAssinatura(conta.idConta);
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
          },
          include: {
            assinatura: true
          }
        });

        if (conta) {
          let autenticacao = await this.prisma.autenticacao.findFirst({
            where: {
              idConta: Number(conta.idConta)
            }
          })
          let assinatura = undefined;
          if (!conta.idAssinatura) {
            assinatura = await this.prisma.assinatura.create({
              data: {
                ativo: true,
                data_inicio: new Date(),
                idPlanos: resultado.idPlanos,
                ultimo_update: new Date()
              }
            })
          } else {
            await this.prisma.assinatura.update({
              where: {
                idAssinatura: Number(conta.idAssinatura)
              },
              data: {
                ativo: true
              }
            })
          }
          await this.prisma.contas.update({
            where: {
              idConta: Number(conta.idConta)
            },
            data: {
              idGrupo: Number(idGrupo),
              idAssinatura: Number(assinatura.idAssinatura)
            }
          })
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

  async removerUsuario(idConta, res, req){
    try {
      const contaExists = await this.prisma.contas.findFirst({
        where: {
          idConta: Number(idConta)
        }
      })

      if (!contaExists){
        return res.status(404).send("Conta não encontrada");
      }

      if (!contaExists.idGrupo){
        return res.status(400).send("O usuário não pertence a nenhum grupo");
      }

      await this.prisma.contas.update({
        where: {
          idConta: Number(idConta)
        },
        data: {
          idGrupo: null
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

