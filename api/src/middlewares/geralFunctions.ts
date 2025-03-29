import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MulterFile } from 'multer';
import { rm } from 'fs/promises';

@Injectable()
export class functionService {

  async getFilesAndFolders(caminho: string): Promise<{ nome: string; tipo: string }[]>  {
    return new Promise((resolve, reject) => {
      fs.readdir(caminho, { withFileTypes: true }, (err, arquivos) => {
        if (err) {
          return reject(`Erro ao ler a pasta: ${err.message}`);
        }
  
        const resultado = arquivos.map(item => {
          return {
            nome: item.name,
            tipo: item.isDirectory() ? 'pasta' : 'arquivo'
          };
        });
  
        resolve(resultado);
      });
    });
  }

  async saveFiles(arquivos: MulterFile | MulterFile[], destino) {
    if (!arquivos || arquivos.length === 0) {
      return;
    }

    try {
      const tempDir = path.join(__dirname, '..', '..', 'src', 'arquivos', destino);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      if (Array.isArray(arquivos)) {

        for (const arquivo of arquivos) {
          const filePath = path.join(tempDir, arquivo.originalname);
          fs.writeFileSync(filePath, arquivo.buffer);
        }
      } else {
        const filePath = path.join(tempDir, arquivos.originalname);
        fs.writeFileSync(filePath, arquivos.buffer);
      }

    } catch (error) {
      console.log(error)
      throw new Error('Erro ao salvar arquivos')
    }
  }

  async deletePath(caminho: string) {
    try {

      const tempDir = path.join(__dirname, '..', '..', 'src', 'arquivos', caminho);
      if (!fs.existsSync(tempDir)) {
        return;
      }
      await rm(tempDir, { recursive: true });
    } catch (error) {
      console.error('Erro ao excluir o caminho:', error.message);
    }
  }

  phoneMask(celular: string): string {
    const celularLimpo = celular.replace(/\D/g, '');
  
    if (celularLimpo.length === 11) {
      return celularLimpo.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        '($1) $2-$3'
      );
    } else {
      return celular;
    }
  }

  formatarEmReais(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  async maskDate(data) {
    const dataString = new Date(data).toISOString();

    const dataFormatada = dataString.substring(0, 10);

    return dataFormatada;
  }
}
