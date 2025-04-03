import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { PrismaService } from 'src/database/PrismaService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { GruposService } from './grupos.service';
import { GrupoDTO } from './dto/grupo.dto';
import { DataDTO } from './dto/data.dto';

@Controller('grupos')
export class GruposController {
  constructor(private readonly GruposService: GruposService,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }


  @Get()
  async findAll(@Res() res: Response,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Usuario"]);
    if (resultado) {
      return this.GruposService.findAll(res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  async findOne(@Res() res: Response,
    @Body("idGrupo") idGrupo: number,
    @Req() req: Request) {
    return this.GruposService.findOne(idGrupo, res, req);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("grupo") grupo: GrupoDTO,
    @Body("datas") datas: DataDTO[],
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin", "Nutricionista"]);
    if (resultado) {
      return this.GruposService.create(grupo, datas, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('inserir/usuario')
  @UsePipes(ValidationPipe)
  async inserirUsuario(@Res() res: Response,
    @Body("idGrupo") idGrupo: number,
    @Body("contasIDS") contasIDS: number[],
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.GruposService.inserirUsuario(idGrupo, contasIDS, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('entrar')
  @UsePipes(ValidationPipe)
  async entrar(@Res() res: Response,
    @Body("idGrupo") idGrupo: number,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Usuario"]);
    if (resultado) {
      return this.GruposService.entrar(idGrupo, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete('remover/usuario/:idConta/:idGrupo')
  @UsePipes(ValidationPipe)
  async removerUsuario(@Res() res: Response,
    @Param('idConta') idConta: number,
    @Param('idGrupo') idGrupo: number,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.GruposService.removerUsuario(idConta, idGrupo, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('arquivos/:idGrupo')
  async getArquivos(@Res() res: Response,
    @Param('idGrupo') idGrupo: number,
    @Req() req: Request) {
    return this.GruposService.getArquivos(idGrupo, res, req);
  }

  @Post('criarPasta')
  async criarPasta(
    @Body("idGrupo") idGrupo: number,
    @Body("caminho") caminho: string[],
    @Body("nomePasta") nomePasta: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin", "Nutricionista"]);
    if (resultado) {
      return this.GruposService.criarPasta(idGrupo, caminho, nomePasta, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('arquivos')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async postArquivos(
    @Res() res: Response,
    @Body("idGrupo") idGrupo: number,
    @UploadedFiles() arquivos: MulterFile[],
    @Req() req: Request,
  ) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin", "Nutricionista"]);
    if (resultado) {
      const tiposAceitos = [
        'jpeg', 'jpg', 'png', 'gif', 'svg',
        'pdf',
        'mp4', 'avi', 'mov', 'wmv',
        'doc', 'docx'
      ];

      try {
        await Promise.all(
          arquivos.map(async (arquivo) => {
            const ext = arquivo.originalname.split('.').pop()?.toLowerCase();

            if (!ext || !tiposAceitos.includes(ext)) {
              throw new Error(`Tipo de arquivo ${ext || 'indefinido'} não é aceito.`);
            }
          })
        );

        return this.GruposService.sendFiles(idGrupo, arquivos, res, req);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }

  }

  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: number,
    @Body("grupo") grupo: GrupoDTO,
    @Body("datas") datas: DataDTO[],
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin", "Nutricionista"]);
    if (resultado) {
      return this.GruposService.update(id, grupo, datas, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.GruposService.delete(id, res, req);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

}
