import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { InfoGeralDTO } from './dto/infoGeral.dto';

@Injectable()
export class InfoGeralService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService) { 
    }

  async create(data: InfoGeralDTO, valorFrete, res, req) {
    try {
      const resultado = await this.prisma.geral.findFirst();

      if(resultado){
        return res.status(400).send("Atualize os dados atuais.")
      }

      if (!valorFrete){
        return res.status(400).send("O valor do frete precisa ser enviado.");
      }

    
      await this.prisma.geral.create({
        data: data
      })

      return res.status(200).send("Cadastrado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async update(id: number, data: InfoGeralDTO, valorFrete, res, req) {
    try {

      const resultado = await this.prisma.geral.findFirst({
        where: {
          idGeral: Number(id)
        }
      })
     
      if (!resultado){
        return res.status(404).send("Nenhuma informação cadastrada com esse ID");
      }

      if (!valorFrete){
        return res.status(400).send("O valor do frete precisa ser enviado.");
      }

      

      await this.prisma.geral.update({
        where: {
          idGeral: Number(id)
        },
        data: {
          emailContato: data.emailContato,
          numeroContato: data.numeroContato,
          qtdeContatos: data.qtdeContatos,
          qtdeEmpresa: data.qtdeEmpresa,
          qtdeFretes: data.qtdeFretes,
          valorFreteIndividual: Number(valorFrete)
        }
      })
      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

}

