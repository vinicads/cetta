import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { AvaliacoesService } from './avaliacoes.service';
import { AvaliacoesDTO } from './dto/avaliacoes.dto';


@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }


  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("avaliacoes") avaliacoes: AvaliacoesDTO,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Empresa"]);
    if (resultado) {
      return this.avaliacoesService.create(avaliacoes, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(":id")
  async getContasDesbloqueadas(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req: Request) {
      return this.avaliacoesService.getNota(id, req, res);
  }


}
