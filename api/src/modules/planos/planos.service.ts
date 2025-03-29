import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { PlanosDTO } from './dto/planos.dto';
import axios from 'axios';

@Injectable()
export class PlanosService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,) {
      
  }

  async create(data: PlanosDTO, res, req) {
    try {

      if (data.valorTotal <= 0) {
        return res.status(400).send("Envie um valor real.");
      }

      const resultado = await this.prisma.planos.findFirst({
        where: {
          nome: data.nome
        }
      });

      if (resultado) {
        return res.status(403).send("Já existe um plano com esse nome");
      }

      await this.prisma.planos.create({
        data: {
          nome: data.nome,
          subtitulo: data.subtitulo,
          descricao: data.descricao,
          valorTotal: data.valorTotal,
          qtdePessoas: data.qtdePessoas,
          tipo: data.tipo,
          tipoFuncionalidade: data.tipoFuncionalidade,
          meses: data.meses,
          maxSessoes: data.maxSessoes,
        }
      })

      return res.status(200).send("Cadastrado com sucesso.");
    } catch (error) {

      return res.status(400).send("Dados incorretos.");
    }
  }

  async update(id: number, data: PlanosDTO, res, req) {
    try {

      const resultado = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(id)
        }
      })

      if (!resultado) {
        return res.status(404).send("Nenhum plano cadastrado com esse ID");
      }

      const verificaNome = await this.prisma.planos.findFirst({
        where: {
          nome: data.nome,
          NOT: {
            idPlanos: Number(id)
          }
        }
      });
      if (verificaNome) {
        return res.status(403).send("Já existe um plano com esse nome");
      }

      if (data.valorTotal <= 0) {
        return res.status(400).send("Envie um valor real.");
      }

      try {

        await this.prisma.planos.update({
          where: {
            idPlanos: Number(id)
          },
          data
        });
    

      } catch (error) {
        return res.status(400).send("Erro ao atualizar os valores." + error);
      }


      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }

  async delete(id, res, req) {
    try {
      const contagem = await this.prisma.planos.count();

      if (contagem < 2) {
        return res.status(400).send("Precisa haver pelo menos um plano.");
      }

      const resultado = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(id)
        }
      });

      if (!resultado) {
        return res.status(404).send("Nenhum plano cadastrado com esse ID")
      };

      const assinaturasExists = await this.prisma.assinatura.findMany({
        where: {
          idPlanos: Number(resultado.idPlanos)
        }
      })
      if (assinaturasExists.length > 0){
        return res.status(400).send("Você não pode excluir um plano com assinaturas dependentes.");
      }

      const gruposExists = await this.prisma.grupos.findMany({
        where: {
          idPlanos: Number(resultado.idPlanos)
        }
      })
      if (gruposExists.length > 0){
        return res.status(400).send("Você não pode excluir um plano com grupos dependentes.");
      }

      try {
  
        await this.prisma.planos.delete({
          where: {
            idPlanos: Number(id)
          }
        })
    } catch (error) {
      console.log(error)
      return res.status(500).send("Algo deu errado ao apagar o produto.");
    }

 

      return res.status(200).send("Apagado com sucesso.");
    } catch (error) {
      return res.status(500).send("Algo deu errado.");
    }

  }

}

