import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class InfoGeralDTO {

    @IsString({ message: 'Email do contato deve ser uma string.' })
    @IsNotEmpty({ message: 'Email do contato precisa ser preenchido.' })
    emailContato: string;

    @IsString({ message: 'Email do médico deve ser uma string.' })
    @IsNotEmpty({ message: 'Email do médico precisa ser preenchido.' })
    emailMedico: string;

    @IsString({ message: 'Número de contato deve ser uma string.' })
    @IsNotEmpty({ message: 'Número de contato precisa ser preenchido.' })
    numeroContato: string;
}
