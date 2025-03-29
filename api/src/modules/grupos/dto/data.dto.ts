import { $Enums } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum, IsDateString } from 'class-validator';

export class DataDTO {

    @IsNumber(undefined, { message: 'O ID da data deve ser um número inteiro.' })
    @IsOptional()
    idData: number;

    @IsEnum($Enums.dias, {message: "Selecione uma opção válida para o dia."})
    @IsNotEmpty({message: "Dia precisa ser preenchido."})
    dia: $Enums.dias;

    @IsString({message: "Hora deve ser do tipo string."})
    @IsNotEmpty({message: "Hora precisa ser preenchida."})
    hora: string;

    @IsNumber(undefined, { message: 'O grupo deve ser um número inteiro.' })
    @IsOptional()
    idGrupo: number;
}
