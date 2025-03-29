import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { $Enums, PrismaClient } from "@prisma/client";
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { UsersService } from './users.service';
import { usersDTO } from './dto/users.dto';
import { contaDTO } from './dto/conta.dto';
import { PrismaService } from 'src/database/PrismaService';
import { usersFunctions } from './functions/users.functions';
import { usersNoPasswordDTO } from './dto/usersNoPassword.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { subYears } from 'date-fns';
import { questionarioDTO } from './dto/questionario.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly usersFunctions: usersFunctions,
    private readonly authFunctions: AuthFunctions,
    private prisma: PrismaService) { }
  @Post()
  @UsePipes(ValidationPipe)

  async create(@Res() res: Response,
    @Body("autenticacao") autenticacao: usersDTO,
    @Body("conta") conta: contaDTO,
    @Req() req: Request) {
    return this.usersService.create(autenticacao, conta, res, req);
  }


  @Get()
  async findAll(@Res() res: Response,
    @Query('nome') nome: string,
    @Query('email') email: string,
    @Query('idadeInicio') idadeInicio: number,
    @Query('idadeFim') idadeFim: number,
    @Query('perfil') perfil: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);

    const filters: any = {};
    if (nome) {
      filters.conta = {
        ...filters.conta,
        nome: {
          contains: nome,
        }
      };
    }

    if (email) {
      filters.email = {
        contains: email,
      };
    }

    const today = new Date();
  let data_nasc_inicio: Date | null = null;
  let data_nasc_final: Date | null = null;

  if (idadeInicio) {
    data_nasc_final = subYears(today, idadeInicio); 
  }

  if (idadeFim) {
    data_nasc_inicio = subYears(today, idadeFim); 
  }

  if (data_nasc_inicio || data_nasc_final) {
    filters.conta = {
      ...filters.conta,
      data_nasc: {
        ...(data_nasc_inicio ? { gte: data_nasc_inicio } : {}), 
        ...(data_nasc_final ? { lte: data_nasc_final } : {}), 
      }
    };
  }

    if (perfil) {
      filters.conta = {
        ...filters.conta,
        perfil: perfil,
      };
    }


    if (resultado) {
      return this.usersService.findAll(res, filters, start, quantity);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('questionario')
  @UsePipes(ValidationPipe)

  async questionario(@Res() res: Response,
    @Body("questionario") questionario: questionarioDTO,
    @Req() req: Request) {
    return this.usersService.postQuestionario(questionario, res, req);
  }


  @Get('/myData')
  async findOne(@Res() res: Response, @Req() req: Request) {
    return this.usersService.findOne(res, req);
  }

  @Put('changePerfil/:id')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async changePerfil(
    @Res() res: Response,
    @UploadedFiles() arquivos: MulterFile[],
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    let tiposAceitosImagem = ['jpeg', 'jpg', 'png']
    let arquivoName = arquivos[0].originalname.split('.');
    if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
      throw new HttpException("Tipo de arquivo não aceito.", HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateProfile(arquivos, id, req, res);
  }

  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: number,
    @Body("autenticacao") autenticacao: usersNoPasswordDTO,
    @Body("conta") conta: contaDTO,
    @Body("assinatura") assinatura: string,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.usersService.update(id, autenticacao, conta, assinatura, res, req);
    } else {
      var data = await this.prisma.autenticacao.findFirst({
        where: {
          idAutenticacao: Number(id)
        },
        include: {
          conta: true,
        }
      })

      if (data) {
        var samePerson = await this.usersFunctions.veriySamePerson(data.email, req);
        if (samePerson) {
          if (conta.perfil != data.conta.perfil) {
            throw new HttpException("Você não tem autorização para atualizar seu perfil.", HttpStatus.UNAUTHORIZED);
          }
          return this.usersService.update(id, autenticacao, conta, assinatura, res, req);
        }
      }
    }
    throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
  }

  @Put('/atualizar/autenticacao')
  async updateEmail(@Res() res: Response,
    @Body("email") email: string,
    @Body("senha") senha: string,
    @Req() req: Request) {
    if (email.length < 5) {
      throw new HttpException("Você precisa enviar um e-mail válido.", HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateAuth(email, senha, req, res);

  }



  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.usersService.delete(id, res, req);
    } else {
      var data = await this.prisma.autenticacao.findFirst({
        where: {
          idAutenticacao: Number(id)
        }
      })

      if (data) {
        var samePerson = await this.usersFunctions.veriySamePerson(data.email, req);
        if (samePerson) {
          return this.usersService.delete(id, res, req, samePerson);
        }
      }
    }
    throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
  }
}
