import { $Enums, veiculo_tipo } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class AvaliacoesDTO {
    @IsInt({ message: 'Recrutador deve ser um número.' })
    @IsNotEmpty({ message: 'Recrutador precisa ser preenchida.' })
    idRecrutador: Number;

    @IsOptional()
    idAvaliador: Number;

    @IsNumber(undefined, { message: 'Nota deve ser um número.' })
    @IsNotEmpty({ message: 'Nota precisa ser preenchida.' })
    nota: Number;

}