import { $Enums } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class VeiculosDTO {

    @IsString({ message: 'A placa do veículo deve ser uma string.' })
    @MaxLength(45, { message: 'A placa do veículo não pode exceder 45 caracteres.' })
    @IsNotEmpty({ message: 'A placa do veículo precisa ser preenchida.' })
    placa: string;

    @IsString({ message: 'O modelo do veículo deve ser uma string.' })
    @MaxLength(100, { message: 'O modelo do veículo não pode exceder 100 caracteres.' })
    @IsNotEmpty({ message: 'O modelo do veículo precisa ser preenchido.' })
    modelo: string;

    @IsEnum($Enums.veiculo_tipo, {message: "Selecione uma opção válida para o tipo de veiculo."})
    @IsNotEmpty({message: "Tipo de veiculo precisa ser preenchido."})
    tipo: $Enums.veiculo_tipo;

    @IsString({ message: 'O ano do veículo deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O ano do veículo precisa ser preenchido.' })
    ano: number;

    @IsString({ message: 'A URL da foto do veículo deve ser uma string.' })
    @IsOptional()
    foto: string;

    @IsInt({ message: 'O ID da conta associada ao veículo deve ser um número inteiro.' })
    @IsOptional()
    idConta: number;

}