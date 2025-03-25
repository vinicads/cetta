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

  @Post('enviarEmailGeral')
  @UsePipes(ValidationPipe)
  async sendMail(@Res() res: Response,
    @Body("perfil") perfil: string[],
    @Body("assinatura") assinatura: string,
    @Body("conteudo") conteudo: string,
    @Req() req: Request) {
      const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);

      const filters: any = {};

      if (!conteudo){
        throw new HttpException("Você precisa enviar o conteúdo do e-mail.", HttpStatus.BAD_REQUEST);
      }

      if (perfil && perfil.length > 0) {
        filters.conta = {
          ...filters.conta,
          perfil: { in: perfil }
        };
      }
  
      if(assinatura){
        filters.conta = {
          ...filters.conta,
          perfil: 'Empresa',
        };
      }

  
      if (resultado) {
        return this.usersService.enviarEmailGeral(filters, assinatura, conteudo, req, res);
      } else {
        throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
      }
  }

  @Get()
  async findAll(@Res() res: Response,
    @Query('nome') nome: string,
    @Query('email') email: string,
    @Query('assinatura') assinatura: string,
    @Query('cpf') cpf: string,
    @Query('cnpj') cnpj: string,
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

    if (cpf || cnpj) {
      filters.conta = {
        ...filters.conta,
        AND: [
          {
            OR: [
              cpf ? { documento: { contains: cpf } } : undefined,
              cnpj ? { documento: { contains: cnpj } } : undefined,
            ].filter(Boolean)
          }
        ]
      };
    }

    if (email) {
      filters.email = {
        contains: email,
      };
    }

    if (perfil) {
      filters.conta = {
        ...filters.conta,
        perfil: perfil,
      };
    }

    if(assinatura){
      filters.conta = {
        ...filters.conta,
        perfil: 'Empresa',
      };
    }

    if (resultado) {
      return this.usersService.findAll(res, filters, assinatura, start, quantity);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('empresas')
  async findAllEmpresas(@Res() res: Response,
    @Query('nome') nome: string,
    @Query('documento') documento: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Recrutador"]);
    if (resultado) {
      const filters: any = {};
      if (nome) {
        filters.conta = {
          ...filters.conta,
          nome: {
            contains: nome,
          }
        };
      }

      if (documento) {
        filters.conta = {
          ...filters.conta,
          documento: {
            contains: documento,
          }
        };
      }

      filters.conta = {
        ...filters.conta,
        perfil: "Empresa"
      }

      return this.usersService.findAllEmpresas(filters, start, quantity, res);
    } else {
      throw new HttpException("Você não tem autorização para realizar essa ação.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('recrutadores')
  async findAllRecrutadores(@Res() res: Response,
    @Query('idRecrutador') idConta: number,
    @Query('nome') nome: string,
    @Query('documento') documento: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Req() req: Request) {
    const filters: any = {};
    if (idConta) {
      filters.conta = {
        ...filters.conta,
        idConta: Number(idConta)
      };
    }

    if (nome) {
      filters.conta = {
        ...filters.conta,
        nome: {
          contains: nome,
        }
      };
    }

    if (documento) {
      filters.conta = {
        ...filters.conta,
        documento: {
          contains: documento,
        }
      };
    }

    filters.conta = {
      ...filters.conta,
      perfil: "Recrutador"
    }

    return this.usersService.findAllRecrutadores(filters, start, quantity, res);
  }

  @Get('/myData')
  async findOne(@Res() res: Response, @Req() req: Request) {
    return this.usersService.findOne(res, req);
  }

  @Put('changePerfil/:id')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async putCertidoes(
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
    @Req() req: Request) {
    const resultado = await this.authFunctions.verifyProfile(req, ["Admin"]);
    if (resultado) {
      return this.usersService.update(id, autenticacao, conta, res, req);
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
          return this.usersService.update(id, autenticacao, conta, res, req);
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
    return this.usersService.updateEmail(email, senha, req, res);

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
