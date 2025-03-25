import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class InfoGeralDTO {

    @IsNumber(undefined, { message: 'Valor do frete individual deve ser um numero.' })
    @IsOptional()
    valorFreteIndividual: number;

    @IsString({ message: 'Email do contato deve ser uma string.' })
    @IsNotEmpty({ message: 'Email do contato precisa ser preenchido.' })
    emailContato: string;

    @IsString({ message: 'Número de contato deve ser uma string.' })
    @IsNotEmpty({ message: 'Número de contato precisa ser preenchido.' })
    numeroContato: string;

    @IsInt({ message: 'Quantidade de contatos deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'Quantidade de contatos precisa ser preenchida.' })
    qtdeContatos: number;

    @IsInt({ message: 'Quantidade de empresas deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'Quantidade de empresas precisa ser preenchida.' })
    qtdeEmpresa: number;

    @IsInt({ message: 'Quantidade de fretes deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'Quantidade de fretes precisa ser preenchida.' })
    qtdeFretes: number;
}
