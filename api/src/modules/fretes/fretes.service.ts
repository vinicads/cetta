import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { FretesDTO } from './dto/fretes.dto';

@Injectable()
export class FretesService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,) { }

  async create(data: FretesDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (!myData.conta.idAssinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if (myData.conta.perfil == 'Empresa') {
        if ((new Date(assinatura.prazo) < new Date()) || assinatura.status == 'Inativo') {
          return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
        }

        if (Number(assinatura.qtdeFretes) <= 0) {
          return res.status(405).send("Seus fretes acabaram. Se deseja continuar usufruindo deste benefício, faça um upgrade no seu plano ou compre mais fretes.");
        }

        data.idEmpresa = Number(myData.idConta);
        let qtdeFretes = Number(assinatura.qtdeFretes) - 1;
        await this.prisma.assinatura.update({
          where: {
            idAssinatura: Number(assinatura.idAssinatura),
          },
          data: {
            qtdeFretes: Number(qtdeFretes)
          }
        })
      } else {
        if (!data.idEmpresa) {
          return res.status(400).send("Você precisa enviar o ID da empresa.");
        }

        const dataEmpresa = await this.prisma.contas.findFirst({
          where: {
            idConta: Number(data.idEmpresa)
          }
        })

        if (!dataEmpresa){
          return res.status(404).send("Empresa não encontrada no sistema");
        }

        const assinaturaEmpresa = await this.prisma.assinatura.findFirst({
          where: {
            idAssinatura: Number(dataEmpresa.idAssinatura)
          }
        })
        
        if (!assinaturaEmpresa){
          return res.status(401).send("Para usufruir deste benefício, a empresa deve possuir uma assinatura ativa.");
        }

        if ((new Date(assinaturaEmpresa.prazo) < new Date()) || assinaturaEmpresa.status == 'Inativo') {
          return res.status(401).send("Para usufruir deste benefício, a empresa deve possuir uma assinatura ativa.");
        }

        if (Number(assinaturaEmpresa.qtdeFretes) <= 0) {
          return res.status(405).send("Os fretes da empresa acabaram.");
        }

        let qtdeFretesEmpresa = Number(assinaturaEmpresa.qtdeFretes) - 1;
        await this.prisma.assinatura.update({
          where: {
            idAssinatura: Number(assinaturaEmpresa.idAssinatura),
          },
          data: {
            qtdeFretes: Number(qtdeFretesEmpresa)
          }
        })


        data.idRecrutador = Number(myData.idConta);
      }

      if (!data.status){
        data.status = "Ativo"
      }

      await this.prisma.fretes.create({
        data
      })

    
      return res.status(200).send("Frete cadastrado com sucesso.");

    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getFretes(filters, start, quantity, req, res){
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (myData.conta.perfil == 'Empresa'){
        filters.idEmpresa = Number(myData.idConta);
      }else{
        filters.idRecrutador = Number(myData.idConta);
      }
      
      let contagem = await this.prisma.fretes.count({
        where: filters
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      var data = await this.prisma.fretes.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhum frete encontrado.");
      } else {
        var newData = {
          "fretes": data,
          "count": contagem
        }

        return res.status(200).send(newData);
      }
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  

  }

  async updateStatus(id, status, res, req){
    try {
    const myData = await this.authFunctions.getMyData(req);
    if (!myData) {
      return res.status(404).send("Não encontramos seus dados no sistema.");
    }

    const frete = await this.prisma.fretes.findFirst({
      where: {
        idFretes: Number(id)
      }
    })

    if (!frete){
      return res.status(404).send("Não encontramos o frete no sistema.");
    }

    if (Number(frete.idEmpresa) != Number(myData.idConta) && Number(frete.idRecrutador) != Number(myData.idConta)){
      return res.status(401).send("Você não pode atualizar o frete de outra pessoa.")
    }

    await this.prisma.fretes.update({
      where: {
        idFretes: Number(id)
      },
      data: {
        status: status
      }
    })

    return res.status(200).send("Status do frete atualizado");

  } catch (error) {
    return res.status(400).send("Dados incorretos.");
  }

    
  }

  async updateFrete(id, fretes: FretesDTO, res, req){
    try {
    const myData = await this.authFunctions.getMyData(req);
    if (!myData) {
      return res.status(404).send("Não encontramos seus dados no sistema.");
    }

    const frete = await this.prisma.fretes.findFirst({
      where: {
        idFretes: Number(id)
      }
    })

    if (!frete){
      return res.status(404).send("Não encontramos o frete no sistema.");
    }

    if (Number(frete.idEmpresa) != Number(myData.idConta) && Number(frete.idRecrutador) != Number(myData.idConta)){
      return res.status(401).send("Você não pode atualizar o frete de outra pessoa.")
    }

    await this.prisma.fretes.update({
      where: {
        idFretes: Number(id)
      },
      data: {
        tipoVeiculo: fretes.tipoVeiculo,
        tiposVeiculos: fretes.tiposVeiculos,
        distancia: fretes.distancia,
        para: fretes.para,
        status: fretes.status,
        valor: Number(fretes.valor),
        de: fretes.de,
        datas: fretes.datas
      }
    })

    return res.status(200).send("Frete atualizado com sucesso");

  } catch (error) {
    return res.status(400).send("Dados incorretos.");
  }

    
  }


}

