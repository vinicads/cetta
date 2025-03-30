import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { PagamentosService } from './pagamentos.service';
import { DadosAssinaturaDTO } from './dto/dadosAssinatura.dto';


@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }

  @Post('/assinatura')
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("assinatura") DadosAssinatura: DadosAssinaturaDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Usuario"]);
    if (resultado) {
      return this.pagamentosService.create(DadosAssinatura, req, res);
    } else {
      throw new HttpException("Apenas usuários podem obter uma assinatura.", HttpStatus.FORBIDDEN);
    }
  }

  @Get('/meuPlano/:idPlanos')
  @UsePipes(ValidationPipe)
  async find(@Res() res: Response,
    @Param('idPlanos') idPlanos: number,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Usuario"]);
    if (resultado) {
      return this.pagamentosService.getPlano(idPlanos, req, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.FORBIDDEN);
    }
  }


  @Post('/webhook')
  async handleStripeEvent(@Body() buffer: any, @Res() res, @Req() req, @Query() queryParams: any,) {
    try {
      await this.pagamentosService.handleStripeWebhook(buffer, queryParams, res);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send('Erro ao lidar com webhook');
    }
  }



}
