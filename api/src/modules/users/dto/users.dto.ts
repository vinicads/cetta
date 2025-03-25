import { $Enums } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class usersDTO {
    @MaxLength(100, {message: "O limite de dígitos do e-mail foi atingido. [email] "})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco. [email] ' })
    @IsString({message:"E-mail deve ser uma string. [email] "})
    @IsNotEmpty({message: "E-mail precisa ser preenchido. [email] "})
    email: string; 

    @MaxLength(20, {message: "O limite de dígitos da senha foi atingido. [senha] "})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco. [senha] ' })
    @IsString({message:"Senha deve ser uma string. [senha] "})
    @IsNotEmpty({message: "Senha precisa ser preenchida. [senha] "})
    senha: string; 
    

    @IsNumber()
    @IsOptional()
    idConta: number;
}
