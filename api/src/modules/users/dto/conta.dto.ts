import { $Enums } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString } from 'class-validator';

export class contaDTO {
    @MaxLength(45, {message: "O limite de dígitos de nome foi atingido. [nome] "})
    @IsString({message:"Nome deve ser uma string. [nome] "})
    @IsNotEmpty({message: "Nome precisa ser preenchido. [nome] "})
    nome: string;

    @IsDateString(undefined, {message: "Data de nascimento deve ser uma data válida. [data_nasc]"})
    @IsNotEmpty({message: "Data de nascimento precisa ser preenchida. [data_nasc]"})
    data_nasc: Date;

    @IsEnum($Enums.contas_perfil, {message: "Selecione uma opção válida para o tipo de perfil. [perfil]"})
    @IsNotEmpty({message: "Perfil precisa ser preenchida. [perfil] "})
    perfil: $Enums.contas_perfil;

    @MaxLength(15, {message: "O limite de dígitos do celular foi atingido. [celular] "})
    @Matches(/^\d+$/, { message: 'O campo do celular deve conter apenas dígitos numéricos. [celular] ' })
    @IsString({message:"Celular deve ser uma string. [celular] "})
    @IsNotEmpty({message: "Celular precisa ser preenchido. [celular]"})
    celular: string;

    @IsString()
    @IsOptional()
    foto: string;

    @IsBoolean()
    @IsOptional()
    fagerstrom: boolean;

    @IsOptional()
    idAssinatura: number;

    @IsOptional()
    idGrupo: number;
}
