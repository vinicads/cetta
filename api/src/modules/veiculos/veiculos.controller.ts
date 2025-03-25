import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { VeiculosService } from './veiculos.service';
import { VeiculosDTO } from './dto/veiculos.dto';

@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('arquivos'))
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @UploadedFiles() arquivos: MulterFile[],
    @Body("veiculos") veiculos: VeiculosDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Motorista"]);
    if (resultado) {
      if (arquivos.length > 0 && arquivos[0] != 'semFoto') {
        let tiposAceitosImagem = ['jpeg', 'jpg', 'png']
        let arquivoName = arquivos[0].originalname.split('.');
        if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
          throw new HttpException("Tipo de arquivo não aceito, envie uma imagem.", HttpStatus.BAD_REQUEST);
        }
      }

      return this.veiculosService.create(veiculos, arquivos, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  async findAll(
    @Query('placa') placa: string,
    @Query('modelo') modelo: string,
    @Query('tipo') tipo: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Res() res: Response,
    @Req() req: Request) {
    let filters: any = {};
    const resultado = await this.authFunctions.verifyProfile(req, ["Motorista"]);
    if (resultado) {
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
        in: tiposArray,
      }
    }
    return this.veiculosService.getVeiculos(filters, start, quantity, req, res);
  } else {
    throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
  }
  }




  @Put(':id')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async update(@Res() res: Response,
    @Param('id') id: number,
    @UploadedFiles() arquivos: MulterFile[],
    @Body("veiculos") veiculos: VeiculosDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Motorista"]);
      if (resultado) {
        if (arquivos.length > 0 && arquivos[0] != 'semFoto') {
          let tiposAceitosImagem = ['jpeg', 'jpg', 'png']
          let arquivoName = arquivos[0].originalname.split('.');
          if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
            throw new HttpException("Tipo de arquivo não aceito, envie uma imagem.", HttpStatus.BAD_REQUEST);
          }
        }
  
        return this.veiculosService.update(id, veiculos, arquivos, res, req);
      } else {
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Motorista"]);
    if (resultado) {

      return this.veiculosService.delete(id, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

}
