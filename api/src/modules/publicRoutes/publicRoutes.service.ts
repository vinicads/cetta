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

  async getGrupos(filters, start, quantity, req, res) {
    try {
      let contagem = await this.prisma.grupos.findMany({
        where: filters,
        include: {
          datas: true 
        }
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      var data = await this.prisma.grupos.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
        orderBy: {
          dataInicio: 'desc'
        }
      });

      if (!data || data.length === 0) {
        return res.status(404).send("Nenhum grupo encontrado.");
      }

      var newData = {
        grupos: data,
        count: contagem.length
      }


      return res.status(200).send(newData);
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }


  }

}

