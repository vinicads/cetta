import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { AvaliacoesDTO } from './dto/avaliacoes.dto';

@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,) { }

  async create(data: AvaliacoesDTO, res, req) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const recrutador = await this.prisma.contas.findFirst({
        where: {
          idConta: Number(data.idRecrutador)
        }
      })

      if (!recrutador){
        return res.status(404).send("Não encontramos o recrutador no sistema.");
      }

      if((recrutador.perfil != 'Recrutador')){
        return res.status(404).send("O perfil da conta fornecida não é de um recrutador.");
      }

      data.idAvaliador = Number(myData.idConta);

      const jaAvaliado = await this.prisma.avaliacoes.findFirst({
        where: {
          idRecrutador: Number(data.idRecrutador),
          idAvaliador: Number(myData.idConta)
        }
      });

      if (Number(data.nota) < 0 || Number(data.nota) > 5){
        return res.status(400).send("Nota inválida.");
      }

      if (jaAvaliado){
        await this.prisma.avaliacoes.update({
          data: {
            nota: Number(data.nota)
          },
          where: {
            idAvaliacoes: Number(jaAvaliado.idAvaliacoes)
          }
        })
        return res.status(200).send("Avaliação atualizada com sucesso.");
      }else{
        await this.prisma.avaliacoes.create({
          data: {
            nota: Number(data.nota),
            idRecrutador: Number(data.idRecrutador),
            idAvaliador: Number(myData.idConta)
          },
        })
        return res.status(200).send("Avaliação enviada com sucesso.");
      }
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getNota(id, req, res){
    try {
      const recrutador = await this.prisma.contas.findFirst({
        where: {
          idConta: Number(id)
        }
      });
  
      if (!recrutador){
        return res.status(404).send("Não encontramos o recrutador no sistema.");
      }
  
      if((recrutador.perfil != 'Recrutador')){
        return res.status(404).send("O perfil da conta fornecida não é de um recrutador.");
      }
  
      const avaliacoes = await this.prisma.avaliacoes.findMany({
        where: {
          idRecrutador: Number(id)
        }
      });
  
      if (Array.isArray(avaliacoes) && avaliacoes.length === 0) {
        return res.status(404).send("Nenhuma avaliação encontrada.");
      } else {
        const soma = avaliacoes.reduce((acc, cur) => acc + cur.nota, 0);

        const media = soma / avaliacoes.length;

        const data = {
          "nota": media
        }
        return res.status(200).send(data);
      }

    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }


}

