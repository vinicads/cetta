import { $Enums } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString } from 'class-validator';

export class AssinaturaDTO {
    @IsNumber(undefined, {message: "ID da assinatura deve ser do tipo number."})
    @IsNotEmpty({message: "Você precisa enviar o ID da assinatura"})
    idAssinatura: number;

    @IsBoolean({message: "Ativo deve ser do tipo booleano."})
    @IsNotEmpty({message: "Você precisa enviar se a assinatura está ativa ou não."})
    ativo: boolean;

    @IsString({message: "Código de pagamento deve ser do tipo string."})
    @IsOptional()
    codPagamento: string;

    @IsNumber(undefined, {message: "ID do plano deve ser do tipo number."})
    @IsNotEmpty({message: "Você precisa enviar o ID do plano"})
    idPlanos: number;
}
