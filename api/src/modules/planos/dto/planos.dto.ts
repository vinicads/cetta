import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class PlanosDTO {

    @IsString({ message: 'O nome do plano deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome do plano precisa ser preenchido.' })
    @MaxLength(45, { message: 'O nome do plano não pode exceder 45 caracteres.' })
    nome: string;

    @IsString({ message: 'A descrição do plano deve ser uma string.' })
    @IsNotEmpty({ message: 'A descrição do plano precisa ser preenchida.' })
    @MaxLength(255, { message: 'A descrição do plano não pode exceder 255 caracteres.' })
    descricao?: string;

    @IsNumber({}, { message: 'O preço do plano deve ser um número.' })
    @IsNotEmpty({ message: 'O preço do plano precisa ser preenchido.' })
    preco: number;


    @IsInt({ message: 'A quantidade de fretes do plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade de fretes do plano precisa ser preenchida.' })
    qtdeFrete: number;

    @IsInt({ message: 'A quantidade de contatos do plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade de contatos do plano precisa ser preenchida.' })
    qtdeContatos: number;
}
