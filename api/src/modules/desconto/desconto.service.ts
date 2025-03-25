import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { DescontoDTO } from './dto/desconto.dto';

@Injectable()
export class DescontoService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,) { }

  async create(data: DescontoDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const empresa = await this.prisma.contas.findFirst({
        where: {
          idConta: Number(data.idEmpresa)
        }
      })

      if (!empresa){
        return res.status(404).send("Não encontramos a empresa no sistema.");
      }

      if((empresa.perfil != 'Empresa')){
        return res.status(404).send("O perfil da conta fornecida não é de uma empresa.");
      }

      const descontoExistente = await this.prisma.desconto.findFirst({
        where: {
          idEmpresa: Number(data.idEmpresa),
        }
      });

      if (Number(data.valor) < 0){
        return res.status(400).send("Valor de desconto inválido.");
      }

      if (descontoExistente){
        data.valor = (Number(data.valor) + Number(descontoExistente.valor));
        await this.prisma.desconto.update({
          data: {
            valor: Number(data.valor)
          },
          where: {
            idDesconto: Number(descontoExistente.idDesconto)
          }
        })
        return res.status(200).send("Desconto atualizado com sucesso.");
      }else{
        let desconto = await this.prisma.desconto.create({
          data: {
            valor: Number(data.valor),
            idEmpresa: Number(data.idEmpresa),
            idContaRecrutador: Number(myData.idConta)
          },
        })

        await this.prisma.contas.update({
          where: {
            idConta: Number(data.idEmpresa)
          },
          data: {
            idDesconto: Number(desconto.idDesconto)
          }
        })
        return res.status(200).send("Desconto enviado com sucesso.");
      }
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getDesconto(req, res){
    try {

      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (myData.conta.perfil != 'Empresa'){
        return res.status(404).send("O perfil da sua conta não é de uma empresa.");
      }

      const desconto = await this.prisma.desconto.findFirst({
        where: {
          idEmpresa: Number(myData.idConta)
        }
      });
  
      if (!desconto) {
        return res.status(404).send("Nenhum desconto consta no sistema.");
      } else {
        return res.status(200).send(desconto);
      }

    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getEmpresas(start, quantity, filters, req, res){
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }
      

      const contagem = await this.prisma.fretes.count({
        where: {
          idRecrutador: Number(myData.idConta)
        },
      });

      if (!start){
        start = 0;
      }

      if (!quantity){
        quantity = contagem
      }

      const contasComFretes = await this.prisma.fretes.findMany({
        where: {
          idRecrutador: Number(myData.idConta)
        },
        skip: Number(start),
        take: Number(quantity)
      });

      let contas = await this.prisma.contas.findMany({
        where: filters,
      });

      let contasComDesconto = await this.prisma.desconto.findMany()


      if (contasComFretes.length > 0) {
        const idsContas = contasComFretes.map(conta => conta.idEmpresa);
        contas = contas.filter(conta => idsContas.includes(conta.idConta));
        contas = contas.map(conta => {
          let desconto = contasComDesconto.find(d => d.idEmpresa === conta.idConta);
          let valor;
          if (desconto){
            valor = desconto.valor;
          }else{
            valor = 0;
          }
          return {
            ...conta,
            desconto: valor
          };
        });
      } else {
        return res.status(404).send("Nenhum conta encontrada.");
      }



      return res.status(200).send(contas)
    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }


}

