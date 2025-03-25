import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { PublicRoutesService } from './publicRoutes.service';

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

  @Post('calcularDistancia')
  async calcularDistancia(
    @Res() res: Response, 
    @Req() req: Request,
    @Body("de") de: string,
    @Body("para") para: string,
  ){
      return this.publicRoutesService.calcularDistanciaCep(de, para, res);
  }

  @Get('/fretes')
  async findFretes(
    @Query('distancia') distancia: number,
    @Query('idRecrutador') idRecrutador: number,
    @Query('valor') valor: number,
    @Query('veiculos') veiculos: string,
    @Query('de') de: string,
    @Query('para') para: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    let filters: any = {};
    if (distancia) {
      filters.distancia = {
        lte: Number(distancia),
      };
    }

    if (valor) {
      filters.valor = {
        lte: Number(valor),
      };
    }

    if (de){
      filters.de = de;
    }
    
    if (para && para.length > 0) {
      const tiposArraypara = para.split(',');

      filters.para = {
        array_contains: tiposArraypara
      }
    }

    if (idRecrutador){
      filters.idRecrutador = Number(idRecrutador);
    }

    if (veiculos && veiculos.length > 0) {
      const tiposArray = veiculos.split(',');

      filters.tiposVeiculos = {
        array_contains: tiposArray
      }
    }
    return this.publicRoutesService.getFretes(filters, start, quantity, req, res);
  } 
}
