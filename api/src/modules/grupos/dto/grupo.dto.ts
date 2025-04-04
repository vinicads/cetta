import { $Enums } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum, IsDateString } from 'class-validator';

export class GrupoDTO {

    @IsDateString(undefined, { message: "Data de início deve ser uma data válida." })
    @IsNotEmpty({ message: "Data de início precisa ser preenchida." })
    dataInicio: Date;

    @IsString({ message: "Link de reunião deve ser do tipo string." })
    @IsOptional()
    link: string;

    @IsDateString(undefined, { message: "Data final deve ser uma data válida." })
    @IsOptional()
    dataFinal: Date;

    @IsNumber(undefined, { message: 'O plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O plano precisa ser preenchido.' })
    idPlanos: number;
}
