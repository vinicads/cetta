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
      const contagem = await this.prisma.planos.count();

      if (contagem >= 3) {
        return res.status(400).send("O limite de planos foi atingido");
      }

      if (data.preco <= 0) {
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

      let preco3 = await this.calcularValor(data.preco, 3);
      let preco6 = await this.calcularValor(data.preco, 6);

      await this.prisma.planos.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          qtdeFrete: data.qtdeFrete,
          qtdeContatos: data.qtdeContatos,
          valorMensal: data.preco,
          valorSemestral: preco6,
          valorTrimestral: preco3
        }
      })

      return res.status(200).send("Cadastrado com sucesso.");
    } catch (error) {

      return res.status(400).send("Dados incorretos.");
    }
  }

  async calcularValor(dados, qtdeMeses) {
    const valorFinal = dados;
    switch (qtdeMeses) {
      case 1:
        return valorFinal;
        break;
      case 3:
        let desconto3 = (valorFinal * 25) / 100;
        let valorRetorno3 = valorFinal - desconto3;
        return valorRetorno3;
        break;
      case 6:
        let desconto = (valorFinal * 38) / 100;
        let valorRetorno = valorFinal - desconto;
        return valorRetorno;
        break;
      default:
        return valorFinal;
        break;
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

      if (data.preco <= 0) {
        return res.status(400).send("Envie um valor real.");
      }

      let preco3 = await this.calcularValor(data.preco, 3);
      let preco6 = await this.calcularValor(data.preco, 6);
      try {

        await this.prisma.planos.update({
          where: {
            idPlanos: Number(id)
          },
          data: {
            nome: data.nome,
            descricao: data.descricao,
            qtdeFrete: Number(data.qtdeFrete),
            qtdeContatos: data.qtdeContatos,
            valorMensal: data.preco,
            valorTrimestral: preco3,
            valorSemestral: preco6,
          }
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

