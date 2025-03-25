import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FretesService } from './fretes.service';
import { FretesDTO } from './dto/fretes.dto';



@Controller('fretes')
export class FretesController {
  constructor(private readonly fretesService: FretesService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }


  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("fretes") fretes: FretesDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Recrutador", "Empresa"]);
    if (resultado) {
      return this.fretesService.create(fretes, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  async findFretes(
    @Query('distancia') distancia: number,
    @Query('valor') valor: number,
    @Query('veiculos') veiculos: string,
    @Query('de') de: string,
    @Query('para') para: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    let filters: any = {};
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa", "Recrutador"]);
    if (resultado) {
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

    if (veiculos && veiculos.length > 0) {
      const tiposArray = veiculos.split(',');

      filters.tiposVeiculos = {
        array_contains: tiposArray
      }
    }
    return this.fretesService.getFretes(filters, start, quantity, req, res);
  } else {
    throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
  }
  }

  @Put('updateStatus/:id')
  async updateSituacao(@Res() res: Response,
    @Param('id') id: number,
    @Body("status") status: $Enums.fretes_status,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Empresa", "Recrutador"]);
      if (resultado) {

        return this.fretesService.updateStatus(id, status, res, req);
      } else {
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }

  @Put(':id')
  async updateFrete(@Res() res: Response,
    @Param('id') id: number,
    @Body("fretes") fretes: FretesDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Empresa", "Recrutador"]);
      if (resultado) {

        return this.fretesService.updateFrete(id, fretes, res, req);
      } else {
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }



}
