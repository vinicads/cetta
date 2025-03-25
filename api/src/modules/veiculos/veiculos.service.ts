import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { VeiculosDTO } from './dto/veiculos.dto';
import { AuthFunctions } from 'src/middlewares/auth.middleware';

@Injectable()
export class VeiculosService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions) { }

  async create(data: VeiculosDTO, arquivos, res, req) {
    try {
      const resultadoVeiculos = await this.prisma.veiculo.findFirst({
        where: {
          placa: data.placa
        }
      });

      if (resultadoVeiculos) {
        return res.status(403).send("A placa inserida já está cadastrada.")
      }

      const myData = await this.authFunctions.getMyData(req);

      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      data.idConta = myData.idConta;

      data.ano = Number(data.ano)
      const resultadoCadastro = await this.prisma.veiculo.create({
        data
      })

      if (arquivos.length > 0 && arquivos != 'semFoto') {
        const caminhoUsuarios = path.join('usuarios', String(myData.idAutenticacao))
        const caminhoVeiculos = path.join(caminhoUsuarios, 'veiculos')
        const caminhoVeiculo = path.join(caminhoVeiculos, String(resultadoCadastro.idVeiculo))
        let caminhoBanco = path.join(caminhoVeiculo, arquivos[0].originalname)
        await this.geralFunctions.deletePath(caminhoVeiculo);
        await this.geralFunctions.saveFiles(arquivos, caminhoVeiculo);
        await this.prisma.veiculo.update({
          data: {
            foto: caminhoBanco
          },
          where: {
            idVeiculo: Number(resultadoCadastro.idVeiculo)
          }
        });
      }



      return res.status(200).send("Cadastrado com sucesso.");
    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getVeiculos(filters, start, quantity, req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      filters.idConta = Number(myData.idConta);

      let contagem = await this.prisma.veiculo.count({
        where: filters
      });
      

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      var data = await this.prisma.veiculo.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
      });


      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhum veiculo encontrado.");
      } else {
        var newData = {
          "veiculos": data,
          "count": contagem
        }

        return res.status(200).send(newData);
      }

    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }



  async update(id: number, data: VeiculosDTO, arquivos, res, req) {
    try {
      const resultadoVeiculos = await this.prisma.veiculo.findFirst({
        where: {
          idVeiculo: Number(id)
        }
      });

      if (!resultadoVeiculos) {
        return res.status(403).send("Veiculo não encontrado no sistema.")
      }

      const myData = await this.authFunctions.getMyData(req);

      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (myData.idConta != resultadoVeiculos.idConta) {
        return res.status(401).send("Você não pode atualizar o veículo de outro motorista.");
      }




      if (arquivos.length > 0 && arquivos != 'semFoto') {
        const caminhoUsuarios = path.join('usuarios', String(myData.idAutenticacao))
        const caminhoVeiculos = path.join(caminhoUsuarios, 'veiculos')
        const caminhoVeiculo = path.join(caminhoVeiculos, String(id))
        let caminhoBanco = path.join(caminhoVeiculo, arquivos[0].originalname)
        await this.geralFunctions.deletePath(caminhoVeiculo);
        await this.geralFunctions.saveFiles(arquivos, caminhoVeiculo);
        data.foto = caminhoBanco;
      }

      const verificaPlaca = await this.prisma.veiculo.findFirst({
        where: {
          placa: data.placa,
          NOT: {
            idVeiculo: Number(id)
          }
        }
      })

      if (verificaPlaca) {
        return res.status(403).send("A placa inserida já está cadastrada.");
      }

      data.ano = Number(data.ano)
      await this.prisma.veiculo.update({
        data,
        where: {
          idVeiculo: Number(id)
        }
      })

      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async delete(id, res, req) {
    try {
      const resultadoVeiculos = await this.prisma.veiculo.findFirst({
        where: {
          idVeiculo: Number(id)
        }
      });

      if (!resultadoVeiculos) {
        return res.status(403).send("Veiculo não encontrado no sistema.")
      }

      const myData = await this.authFunctions.getMyData(req);

      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (myData.idConta != resultadoVeiculos.idConta) {
        return res.status(401).send("Você não pode excluir o veículo de outro motorista.");
      }

      const caminhoUsuarios = path.join('usuarios', String(myData.idAutenticacao))
      const caminhoVeiculos = path.join(caminhoUsuarios, 'veiculos')
      const caminhoVeiculo = path.join(caminhoVeiculos, String(id))
      await this.geralFunctions.deletePath(caminhoVeiculo);

      await this.prisma.veiculo.delete({
        where: {
          idVeiculo: Number(id)
        }
      });

      return res.status(200).send("Veiculo apagado com sucesso.");

    } catch (error) {
      console.log(error)
      return res.status(500).send("Algo deu errado.");
    }

  }

}

