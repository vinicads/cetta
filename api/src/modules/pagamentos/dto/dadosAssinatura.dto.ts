import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class DadosAssinaturaDTO {

    @IsNumber(undefined, { message: 'O código da assinatura deve ser um numero.' })
    @IsNotEmpty({ message: 'O código da assinatura precisa ser preenchido.' })
    idPlanos: number;

    @IsNumber(undefined, { message: 'O código do grupo deve ser um numero.' })
    @IsOptional()
    idGrupo: number;
}
