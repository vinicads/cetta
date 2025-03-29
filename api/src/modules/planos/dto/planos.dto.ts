import { $Enums } from '@prisma/client';
import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsEmail, IsBoolean, IsNumber, MaxLength, ArrayMaxSize, ArrayMinSize, IsEnum } from 'class-validator';

export class PlanosDTO {

    @IsString({ message: 'O nome do plano deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome do plano precisa ser preenchido.' })
    @MaxLength(45, { message: 'O nome do plano não pode exceder 45 caracteres.' })
    nome: string;

    @IsString({ message: 'O subtitulo do plano deve ser uma string.' })
    @IsNotEmpty({ message: 'O subtitulo do plano precisa ser preenchida.' })
    @MaxLength(255, { message: 'O subtitulo do plano não pode exceder 255 caracteres.' })
    subtitulo: string;

    @IsString({ message: 'A descrição do plano deve ser uma string.' })
    @IsNotEmpty({ message: 'A descrição do plano precisa ser preenchida.' })
    @MaxLength(255, { message: 'A descrição do plano não pode exceder 255 caracteres.' })
    descricao: string;

    @IsNumber({}, { message: 'O preço do plano deve ser um número.' })
    @IsNotEmpty({ message: 'O preço do plano precisa ser preenchido.' })
    valorTotal: number;

    
    @IsEnum($Enums.tipoFuncionalidade, {message: "Selecione uma opção válida para o tipo de funcionalidade do plano."})
    @IsNotEmpty({message: "Tipo de funcionalidade precisa ser preenchido."})
    tipoFuncionalidade: $Enums.tipoFuncionalidade;

    @IsEnum($Enums.tipoPlano, {message: "Selecione uma opção válida para o tipo de plano."})
    @IsNotEmpty({message: "Tipo de plano precisa ser preenchido."})
    tipo: $Enums.tipoPlano;

    @IsInt({ message: 'A quantidade de pessoas do plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade de pessoas do plano precisa ser preenchida.' })
    qtdePessoas: number;

    @IsInt({ message: 'A quantidade de meses do plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade de meses do plano precisa ser preenchida.' })
    meses: number;

    @IsInt({ message: 'A quantidade máxima de sessões semanais do plano deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'A quantidade máxima de sessões semanais do plano precisa ser preenchida.' })
    maxSessoes: number;
}
