import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { InfoGeralService } from './infoGeral.service';
import { InfoGeralDTO } from './dto/infoGeral.dto';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';

@Controller('infoGeral')
export class InfoGeralController {
  constructor(private readonly infoGeralService: InfoGeralService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }
  @Post()
  @UsePipes(ValidationPipe)
  
  async create(@Res() res: Response,
    @Body("infoGeral") infoGeral: InfoGeralDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
      if (resultado){
  
        return this.infoGeralService.create(infoGeral,res, req);
      }else{
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }


  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: number,
    @Body("infoGeral") infoGeral: InfoGeralDTO,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
      if (resultado){
        return this.infoGeralService.update(id, infoGeral, res, req);
      }else{
          throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
        }
  }

}
