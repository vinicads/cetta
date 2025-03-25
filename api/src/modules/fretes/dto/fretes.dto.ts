import { $Enums, veiculo_tipo } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class FretesDTO {
    @MaxLength(8, {message: "O limite de dígitos de origem foi atingido."})
    @IsString({message: "Origem deve ser uma string."})
    @IsNotEmpty({message: "Origem precisa ser preenchido."})
    de: string;

    @ArrayMinSize(1, { message: "Deve haver pelo menos um destino." })
    @ArrayMaxSize(10, { message: "Não são permitidas mais que 10 destinos." })
    @IsNotEmpty({message: "Destino precisa ser preenchido."})
    para: string[];

    @IsNumber({}, {message: "Valor deve ser um número."})
    @IsNotEmpty({message: "Valor precisa ser preenchido."})
    valor: number;


    @ArrayMinSize(1, { message: "Deve haver pelo menos uma data." })
    @ArrayMaxSize(10, { message: "Não são permitidas mais que 10 datas." })
    @IsNotEmpty({ message: "As datas não podem estar vazias." }) 
    datas: string[];

    @ArrayMinSize(1, { message: "Deve haver pelo menos um tipo de veiculo." })
    @ArrayMaxSize(10, { message: "Não são permitidos mais que 10 tipos de veiculos." })
    @IsNotEmpty({ message: "Os tipos de veiculos não podem estar vazios." }) 
    tiposVeiculos: string[];

    @IsNumber({}, {message: "Distância deve ser um número."})
    @IsNotEmpty({message: "Distância precisa ser preenchida."})
    distancia: number;

    @IsEnum($Enums.fretes_status, {message: "Selecione uma opção válida para o status."})
    @IsOptional()
    status: $Enums.fretes_status;

    @IsEnum($Enums.tipos_Veiculos, {message: "Selecione uma opção válida para o tipo de veiculo."})
    @IsNotEmpty({message: "Tipo de veiculo precisa ser preenchido."})
    tipoVeiculo: $Enums.tipos_Veiculos;

    @IsNumber({}, {message: "ID da empresa deve ser um número."})
    @IsOptional()
    idEmpresa: number;

    @IsNumber({}, {message: "ID do recrutador deve ser um número."})
    @IsOptional()
    idRecrutador?: number;

}