import { $Enums, veiculo_tipo } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class DescontoDTO {
    @IsNumber(undefined, { message: 'Empresa deve ser um número.' })
    @IsNotEmpty({ message: 'Empresa precisa ser preenchida.' })
    idEmpresa: Number;

    @IsOptional()
    idContaRecrutador: Number;

    @IsNumber(undefined, { message: 'Valor deve ser um número.' })
    @IsNotEmpty({ message: 'Valor precisa ser preenchido.' })
    valor: Number;

}