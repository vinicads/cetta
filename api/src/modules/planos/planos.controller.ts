import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { PlanosService } from './planos.service';
import { PlanosDTO } from './dto/planos.dto';

@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }
  @Post()
  @UsePipes(ValidationPipe)
  
  async create(@Res() res: Response,
    @Body("planos") planos: PlanosDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
      if (resultado){
        return this.planosService.create(planos, res, req);
      }else{
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }

  


  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: number,
    @Body("planos") planos: PlanosDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
      if (resultado){
        return this.planosService.update(id, planos, res, req);
      }else{
          throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
        }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado){
      return this.planosService.delete(id, res, req);
    }else{
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

}
