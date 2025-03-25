import { $Enums, veiculo_tipo } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class ContasDesbloqueadasDTO {
    @IsOptional()
    mei: string;

    @IsOptional()
    antt: string;

    @IsOptional()
    tipo: string[];

    @IsOptional()
    qtdeContatos: number;
}