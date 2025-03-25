import { $Enums } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString } from 'class-validator';

export class contaDTO {
    @MaxLength(45, {message: "O limite de dígitos de nome foi atingido. [nome] "})
    @IsString({message:"Nome deve ser uma string. [nome] "})
    @IsNotEmpty({message: "Nome precisa ser preenchido. [nome] "})
    nome: string;

    
    @IsEnum($Enums.contas_documento, {message: "Selecione uma opção válida para o tipo de documento. [documento]"})
    @IsNotEmpty({message: "Tipo de documento precisa ser preenchida. [documento] "})
    tipoDocumento: $Enums.contas_documento;

    @MaxLength(15, {message: "O limite de dígitos de documento foi atingido. [documento] "})
    @Matches(/^\d+$/, { message: 'O campo documento deve conter apenas dígitos numéricos. [documento] ' })
    @IsString({message:"Documento deve ser uma string. [documento] "})
    @IsNotEmpty({message: "Documento precisa ser preenchido. [documento]"})
    documento: string;

    @IsEnum($Enums.contas_perfil, {message: "Selecione uma opção válida para o tipo de perfil. [perfil]"})
    @IsNotEmpty({message: "Perfil precisa ser preenchida. [perfil] "})
    perfil: $Enums.contas_perfil;

    @MaxLength(15, {message: "O limite de dígitos do contato foi atingido. [telefone] "})
    @Matches(/^\d+$/, { message: 'O campo do contato deve conter apenas dígitos numéricos. [telefone] ' })
    @IsString({message:"Contato deve ser uma string. [telefone] "})
    @IsNotEmpty({message: "Contato precisa ser preenchido. [telefone]"})
    contato: string;

    @MaxLength(8, {message: "O limite de dígitos do CEP foi atingido. [cep] "})
    @MinLength(8, {message: "O campo CEP possui um minimo de dígitos. [cep] "})
    @Matches(/^\d+$/, { message: 'O campo do CEP deve conter apenas dígitos numéricos. [cep] ' })
    @IsString({message:"CEP deve ser uma string. [cep] "})
    @IsNotEmpty({message: "CEP precisa ser preenchido. [cep]"})
    cep: string;

    @IsString()
    @IsOptional()
    foto: string;

    @IsOptional()
    @IsBoolean()
    antt: string;

    @IsOptional()
    @IsBoolean()
    mei: string;

    @IsEnum($Enums.tipos_Veiculos, {message: "Selecione uma opção válida para o tipo de veiculo. [perfil]"})
    @IsOptional()
    tipoVeiculo: $Enums.tipos_Veiculos;

    @IsOptional()
    idAssinatura: number;
}
