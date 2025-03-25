import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { DescontoService } from './desconto.service';
import { DescontoDTO } from './dto/desconto.dto';



@Controller('desconto')
export class DescontoController {
  constructor(private readonly descontoService: DescontoService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }


  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("desconto") desconto: DescontoDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Recrutador"]);
    if (resultado) {
      return this.descontoService.create(desconto, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("/meuDesconto")
  async getContasDesbloqueadas(
    @Res() res: Response,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
      if (resultado) {
      return this.descontoService.getDesconto(req, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("/empresas")
  async getEmpresas(
    @Query('nome') nome: string,
    @Query('documento') documento: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Recrutador"]);
      if (resultado) {
        let filtersConta: any = {};
      if (nome) {
        filtersConta.nome = {
          contains: nome,
        };
      }

      if (documento) {
        filtersConta.documento = {
          contains: documento,
        };
      }

      return this.descontoService.getEmpresas(start, quantity, filtersConta, req, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }


}
