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
      let contagem = 0;

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      var data = await this.prisma.grupos.findMany({
        where: {
          dataInicio: filters.dataInicio
        },
        orderBy: {
          dataInicio: 'desc'
        },
        include: {
          datas: true,
          planos: true
        }
      });

      if (!data || data.length === 0) {
        console.log(data)
        return res.status(404).send("Nenhum grupo encontrado.");
      }

      let grupos = []
      await Promise.all(data.map(async (grupo) => {
        try {
          let datas = await this.prisma.datas.findMany({
            where: {
              idGrupo: grupo.idGrupo,
              dia: {
                in: filters.datas
              }
            }
          })
          if (datas.length == 0){
            return;
          }
  
          let planos = await this.prisma.planos.findFirst({
            where: {
              idPlanos: grupo.idPlanos,
              tipo: filters.tipo,
              tipoFuncionalidade: filters.tipoFuncionalidade
            }
          });
  
          if (!planos){
            return;
          }
  
          let dataGrupo = {
            ...grupo,
            datas,
            planos
          }
  
          grupos.push(dataGrupo)
  
        } catch (error) {
          console.log(error)
        }
      }));

      contagem = grupos.length;
      grupos = grupos.slice(start, start + quantity);
      
      if (!grupos || grupos.length === 0) {
        return res.status(404).send("Nenhum grupo encontrado.");
      }

      let contasCount = 0;
      await Promise.all(grupos.map(async (grupo) => {
        contasCount = await this.prisma.grupoConta.count({
          where: {
            idGrupo: grupo.idGrupo
          },
        });

        grupo['contasCount'] = contasCount;
      }));

      var newData = {
        grupos: grupos,
        count: contagem
      }


      return res.status(200).send(newData);
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }


  }

}

