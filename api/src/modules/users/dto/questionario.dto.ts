import { $Enums } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString } from 'class-validator';

export class questionarioDTO {

    @MaxLength(45, {message: "O limite de dígitos de questão 1 foi atingido."})
    @IsString({message:"Questão 1 deve ser uma string."})
    @IsNotEmpty({message: "Questão 1 precisa ser preenchido."})
    questao1: string;

    @MaxLength(45, {message: "O limite de dígitos de questão 2 foi atingido."})
    @IsString({message:"Questão 2 deve ser uma string."})
    @IsNotEmpty({message: "Questão 2 precisa ser preenchido."})
    questao2: string;

    @MaxLength(45, {message: "O limite de dígitos de questão 3 foi atingido."})
    @IsString({message:"Questão 3 deve ser uma string."})
    @IsNotEmpty({message: "Questão 3 precisa ser preenchido."})
    questao3: string;

    @MaxLength(45, {message: "O limite de dígitos de questão 4 foi atingido."})
    @IsString({message:"Questão 4 deve ser uma string."})
    @IsNotEmpty({message: "Questão 4 precisa ser preenchido."})
    questao4: string;

    @MaxLength(45, {message: "O limite de dígitos de questão 5 foi atingido."})
    @IsString({message:"Questão 5 deve ser uma string."})
    @IsNotEmpty({message: "Questão 5 precisa ser preenchido."})
    questao5: string;

    @IsOptional()
    idQuestionario: number;
}
