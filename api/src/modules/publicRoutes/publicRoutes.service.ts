import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import axios from 'axios';
import * as geolib from 'geolib';
import { addMonths, differenceInMonths, getMonth } from 'date-fns';

@Injectable()
export class PublicRoutesService {
  constructor(private prisma: PrismaService,) { }


  async findInfoGeral(res) {
    try {
      const data = await this.prisma.geral.findFirst();

      if (!data) {
        return res.status(404).send("Não existe nenhuma informação cadastrada");
      }

      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async findPlanos(res) {
    try {
      const data = await this.prisma.planos.findMany();

      if (data.length == 0) {
        return res.status(404).send("Não existe nenhum plano cadastrado");
      }

      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async getFretes(filters, start, quantity, req, res) {
    try {
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
        orderBy: {
          idRecrutador: 'desc'
        }
      });

      if (!data || data.length === 0) {
        return res.status(404).send("Nenhum frete encontrado.");
      }

      const fretesRecrutadores = data.filter(frete => frete.idRecrutador);
      const fretesSemRecrutador = data.filter(frete => !frete.idRecrutador);

      const fretesRecrutadoresFormatados = fretesRecrutadores.map(frete => ({
        de: frete.de,
        status: frete.status,
        para: frete.para,
        tipoVeiculo: frete.tipoVeiculo == "CargaSeca" ? "Carga Seca" : frete.tipoVeiculo,
        valor: frete.valor,
        datas: frete.datas,
        tiposVeiculos: frete.tiposVeiculos,
        distancia: frete.distancia,
        recrutador: true,
      }));

      const fretesFormatados = fretesSemRecrutador.map(frete => ({
        de: frete.de,
        para: frete.para,
        valor: frete.valor,
        tipoVeiculo: frete.tipoVeiculo == "CargaSeca" ? "Carga Seca" : frete.tipoVeiculo,
        status: frete.status,
        datas: frete.datas,
        tiposVeiculos: frete.tiposVeiculos,
        distancia: frete.distancia,
        recrutador: false,
      }));

      var newData = {
        fretesRecrutadores: fretesRecrutadoresFormatados,
        fretes: fretesFormatados,
        count: contagem
      }


      return res.status(200).send(newData);
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }


  }

  async calcularDistanciaCep(de, para, res) {
    try {
      const responseDe = await this.getCEP(de);
      const latEmpresaDe = responseDe.data.lat;
      const lonEmpresaDe = responseDe.data.lng;
      const responsePara = await this.getCEP(para);
      const latEmpresaPara = responsePara.data.lat;
      const lonEmpresaPara = responsePara.data.lng;
      const distancia = this.calcularDistancia(Number(latEmpresaDe), Number(lonEmpresaDe), Number(latEmpresaPara), Number(lonEmpresaPara));

      if (distancia) {
        return res.status(200).send({
          "distancia": distancia
        })
      } else {
        return res.status(404).send("CEP incorreto.")
      }
    } catch (error) {
      return res.status(400).send("Dados incorretos.")
    }
  }


  async getCEP(cep) {
    try {
      const resposta = await axios.get(`${process.env.apiCEP}/${cep}`);
      return resposta;
    } catch (error) {
      return null;
    }
  }

  calcularDistancia(lat1, lon1, lat2, lon2) {
    const distancia = geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    const distanciaEmKm = distancia / 1000;
    return distanciaEmKm;
  }

}

