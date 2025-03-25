import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req } from '@nestjs/common';
import { response } from 'express';
import { LoginService } from './login.service';
import { loginDTO } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response, @Req() req: Request,
    @Body() login: loginDTO) {
    return this.loginService.verify(login, res, req);
  }

  @Get()
  find(@Req() req: Request, @Res() res: Response) {
    return this.loginService.find(req, res);
  }

  @Get("/logout")
  logout(@Req() req: Request, @Res() res: Response) {
    return this.loginService.logout(req, res);
  }

  @Get("/cookieAccepted")
  cookieAccepted(@Res() res: Response, @Req() req: Request){
    return this.loginService.cookieAccepted(req, res);
  }

  @Post("forgotPassword")
  forgotPassword(@Res() res: Response, @Req() req: Request, 
  @Body("email") email: string)
  {
    if (!email){
      throw new HttpException("Você precisa enviar um e-mail.", HttpStatus.BAD_REQUEST);
    }
    return this.loginService.forgotPassword(email, req, res);
  }

    @Get("verifyCode/:code")
  verifyCode(@Res() res: Response, @Req() req: Request, 
  @Param("code") code: string){
    return this.loginService.verifyCode(code, req, res);
  }
  
  @Post("changePassword/:code")
  changePassword(@Res() res: Response, @Req() req: Request, 
  @Body() dados: loginDTO,
  @Param("code") code: string){
    return this.loginService.changePassword(dados, code, req, res);
  }


}
