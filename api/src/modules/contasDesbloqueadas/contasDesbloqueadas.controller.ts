import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { ContasDesbloqueadasService } from './contasDesbloqueadas.service';
import { ContasDesbloqueadasDTO } from './dto/contasDesbloqueadas.dto';

@Controller('contasDesbloqueadas')
export class ContasDesbloqueadasController {
  constructor(private readonly contasDesbloqueadasService: ContasDesbloqueadasService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }

  @Get('exportarParaExcel')
  async exportar(
    @Res() res: Response,
    @Req() req: Request
  ) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
    if (resultado) {
      return this.contasDesbloqueadasService.desbloquear(res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/desbloquearContas')
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("contasDesbloqueadas") contasDesbloqueadas: ContasDesbloqueadasDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
    if (resultado) {
      return this.contasDesbloqueadasService.create(contasDesbloqueadas, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  async getContasDesbloqueadas(
    @Query('nome') nome: string,
    @Query('mei') mei: string,
    @Query('antt') antt: string,
    @Query('tipo') tipo: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
    if (resultado) {
      let filtersConta: any = {};
      let filtersVeiculos: any = {};

      if (nome) {
        filtersConta.nome = {
          contains: nome,
        };
      }

      if (mei) {
        if(mei == 'true'){
          filtersConta.mei = true
        }else{
          filtersConta.mei = false
        }
      }

      if (antt) {
        if(antt == 'true'){
          filtersConta.antt = true
        }else{
          filtersConta.antt = false
        }
      }

      if (tipo && tipo.length > 0) {
        const tiposArray = tipo.split(',');

        filtersVeiculos.tipo = {
          in: tiposArray
        }
      }
      return this.contasDesbloqueadasService.getContasDesbloqueadas(filtersConta, filtersVeiculos, start, quantity, req, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('/veiculos/:idMotorista')
  async getVeiculos(
    @Param('idMotorista') idMotorista: number,
    @Query('placa') placa: string,
    @Query('modelo') modelo: string,
    @Query('tipo') tipo: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
    if (resultado) {
      let filters: any = {};
      if (placa) {
        filters.placa = {
          contains: placa,
        };
      }
  
      if (modelo) {
        filters.modelo = {
          contains: modelo,
        };
      }
  
      if (tipo && tipo.length > 0) {
        const tiposArray = tipo.split(',');
  
        filters.tipo = {
          array_contains: tiposArray
        }
      }
      return this.contasDesbloqueadasService.getVeiculos(idMotorista, filters, start, quantity, req, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

}
