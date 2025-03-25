import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class DadosAssinaturaDTO {

    @IsNumber(undefined, { message: 'O código da assinatura deve ser um numero.' })
    @IsNotEmpty({ message: 'O código da assinatura precisa ser preenchido.' })
    idPlanos: number;

    @IsInt({ message: 'A quantidade de meses da assinatura deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade de meses da assinatura precisa ser preenchida.' })
    qtdeMeses: number;

    @IsBoolean({ message: 'Usar desconto deve ser um booleano.' })
    @IsNotEmpty({ message: 'Usar desconto deve ser preenchida.' })
    usarDesconto: boolean
}
