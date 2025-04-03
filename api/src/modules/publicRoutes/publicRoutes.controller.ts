import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { PublicRoutesService } from './publicRoutes.service';
import { tipoFuncionalidade } from '@prisma/client';
import { filter } from 'rxjs';

@Controller('public')
export class PublicRoutesController {
  constructor(private readonly publicRoutesService: PublicRoutesService) { }

  @Get('files/:pasta/:nome/:destino?/:nomeArquivo?/:nomenclatura?')
  serveFile(
    @Param('pasta') pasta: string = '',  
    @Param('nome') nome: string = '',  
    @Param('destino') destino: string = '',  
    @Param('nomeArquivo') nomeArquivo: string = '',  
    @Param('nomenclatura') nomenclatura: string = '',  
    @Res() res: Response) {
      try {
        const segments = ['../../../src', 'arquivos', pasta, nome, destino, nomeArquivo, nomenclatura].filter(segment => segment !== '');
        let file = path.join(__dirname, ...segments);  
        if (!fs.existsSync(file)){
          return res.status(404).send("Nenhum arquivo encontrado.");
        }

        try {
          const arquivos = fs.readdirSync(file);
          if (arquivos){
            file = path.join(file, arquivos[0])
          }

        } catch (error) {}
        

        return res.sendFile(file);
      } catch (error) {
        console.log(error)
        return res.status(404).send("Nenhum arquivo encontrado.");
      }
   
  }

  @Get('/infoGeral')
  async findInfoGeral(  @Res() res: Response, 
    @Req() req: Request) {
        return this.publicRoutesService.findInfoGeral(res);
  }

  @Get('/planos')
  async findPlanos(  @Res() res: Response, 
    @Req() req: Request) {
        return this.publicRoutesService.findPlanos(res);
  }


  @Get('/grupos')
  async findGrupos(
    @Query('tipoFuncionalidade') tipoFuncionalidade: string,
    @Query('tipo') tipo: string,
    @Query('data_inicio') data_inicio: string,
    @Query('data_final') data_final: string,
    @Query('dias') dias: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    let filters: any = {};

    if (tipo){
      filters.tipo = tipo;
    }

    if(tipoFuncionalidade){
      filters.tipoFuncionalidade = tipoFuncionalidade;
    }
    
    if (data_inicio || data_final) {
      filters.dataInicio =  {
          ...(data_inicio ? { gte: new Date(data_inicio) } : {}),
          ...(data_final ? { lte: new Date(data_final) } : {}), 
      };
    }

    if (dias && dias.length > 0) {
      const diasBuscados = dias.split(",");
      filters.datas = diasBuscados
    }

    return this.publicRoutesService.getGrupos(filters, start, quantity, req, res);
  } 
}
