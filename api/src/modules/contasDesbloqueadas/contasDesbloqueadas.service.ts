import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import * as path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { ContasDesbloqueadasDTO } from './dto/contasDesbloqueadas.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ContasDesbloqueadasService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,
    @InjectQueue('geral') private readonly geralQueue: Queue) { }

  async create(data: ContasDesbloqueadasDTO, res, req) {
    try {
      let filtersContas: any = {};
      let filtersVeiculos: any = {};

      if (data) {
        if (data.mei !== undefined) {
          let mei = data.mei == 'true';
          filtersContas.mei = mei
        }

        if (data.antt !== undefined) {
          let antt = data.antt == 'true';
          filtersContas.antt = antt
        }

        if (data.tipo && data.tipo.length > 0) {

          filtersVeiculos.tipo = {
            in: data.tipo
          }
        }
      }


      filtersContas.perfil = 'Motorista';


      //verificando liberacao
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      if (!myData.conta.idAssinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if ((new Date(assinatura.prazo) < new Date()) || assinatura.status == 'Inativo') {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if (Number(assinatura.qtdeContatos) <= 0) {
        return res.status(401).send("Você não tem mais contatos para liberar. Se desejar mais, faça um upgrade no seu plano.");
      }

      let quantity;
      if (data.qtdeContatos) {
        if (Number(data.qtdeContatos) >= Number(assinatura.qtdeContatos)) {
          data.qtdeContatos = Number(assinatura.qtdeContatos);
        }
        quantity = Number(data.qtdeContatos);
      } else {
        quantity = Number(assinatura.qtdeContatos)
      }

      //recebdo contas ja desbloqueadas pela empresa
      const contasJaDesbloqueadas = await this.prisma.contasdesbloqueadas.findMany({
        where: {
          idEmpresa: Number(myData.idConta)
        }
      });

      let contas = await this.prisma.contas.findMany({
        where: filtersContas,
      });


      if (contasJaDesbloqueadas.length > 0) {
        const empresasDesbloqueadasIds = contasJaDesbloqueadas.map(contaDesbloqueada => contaDesbloqueada.idContato);

        contas = contas.filter(conta => !empresasDesbloqueadasIds.includes(conta.idConta));
      }

      const contasComVeiculos = [];
      for (const conta of contas) {
        filtersVeiculos.idConta = Number(conta.idConta);

        if (filtersVeiculos.tipo) {
          const veiculos = await this.prisma.veiculo.findMany({
            where: filtersVeiculos
          });

          if (veiculos.length > 0) {
            contasComVeiculos.push({
              idConta: Number(conta.idConta),
              cep: conta.cep
            });
          }
        } else {
          contasComVeiculos.push({
            idConta: Number(conta.idConta),
            cep: conta.cep
          });
        }

      }



      if (contasComVeiculos.length == 0) {
        return res.status(404).send("No momento, não existe nenhum motorista que encaixa com suas necessidades.");
      }

      const jobData = {
        empresa: myData,
        contas: contasComVeiculos,
        quantidade: quantity,
      };
      this.geralQueue.add('desbloquearContatos', {
        jobData
      });

      return res.status(200).send("Desbloqueamos os contatos com suas necessidades e mais proximos de voce.");
    } catch (error) {
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getContasDesbloqueadas(filtersConta, filtersVeiculos, start, quantity, req, res) {
    try {
      //verificando liberacao
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const contagem = await this.prisma.contasdesbloqueadas.count({
        where: {
          idEmpresa: Number(myData.idConta)
        },
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      if (!myData.conta.idAssinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if ((new Date(assinatura.prazo) < new Date()) || assinatura.status == 'Inativo') {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      //recebdo contas ja desbloqueadas pela empresa
      const contasJaDesbloqueadas = await this.prisma.contasdesbloqueadas.findMany({
        where: {
          idEmpresa: Number(myData.idConta)
        },
        skip: Number(start),
        take: Number(quantity)
      });

      let contas = await this.prisma.contas.findMany({
        where: filtersConta,
      });

      if (contasJaDesbloqueadas.length > 0) {
        const empresasDesbloqueadasIds = contasJaDesbloqueadas.map(contaDesbloqueada => contaDesbloqueada.idContato);
        contas = contas.filter(conta => empresasDesbloqueadasIds.includes(conta.idConta));
      } else {
        return res.status(404).send("Nenhum conta encontrada.");
      }

      const contasComVeiculos = [];
      for (const conta of contas) {
        filtersVeiculos.idConta = Number(conta.idConta);
        const veiculos = await this.prisma.veiculo.findMany({
          where: filtersVeiculos
        });

        const tiposVeiculos = [];
        const veiculosConta = []
        for (const veiculo of veiculos) {
          if (!tiposVeiculos.includes(veiculo.tipo)) {
            tiposVeiculos.push(veiculo.tipo);
          }
          veiculosConta.push(veiculo)
        }

        const pessoa = await this.prisma.autenticacao.findFirst({
          where: {
            idConta: conta.idConta
          }
        });

 
          contasComVeiculos.push({
            conta: { ...conta, email: pessoa.email, veiculos: tiposVeiculos }, 
            veiculos: veiculosConta
          });
     


      }

      if (Array.isArray(contasComVeiculos) && contasComVeiculos.length === 0) {
        return res.status(404).send("Nenhum conta encontrada.");
      } else {
        var newData = {
          "contasDesbloqueadas": contasComVeiculos,
          "count": contagem
        }

        return res.status(200).send(newData);
      }

    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

  async desbloquear(res, req) {
    try {
      //verificando liberacao
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }


      if (!myData.conta.idAssinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if ((new Date(assinatura.prazo) < new Date()) || assinatura.status == 'Inativo') {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      //recebdo contas ja desbloqueadas pela empresa
      const contasJaDesbloqueadas = await this.prisma.contasdesbloqueadas.findMany({
        where: {
          idEmpresa: Number(myData.idConta)
        },
      });

      let contas = await this.prisma.contas.findMany();

      if (contasJaDesbloqueadas.length > 0) {
        const empresasDesbloqueadasIds = contasJaDesbloqueadas.map(contaDesbloqueada => contaDesbloqueada.idContato);
        contas = contas.filter(conta => empresasDesbloqueadasIds.includes(conta.idConta));
      } else {
        return res.status(404).send("Nenhum conta encontrada.");
      }

      const contasComVeiculos = [];
      for (const conta of contas) {
        const veiculos = await this.prisma.veiculo.findMany({
          where: {
            idConta: conta.idConta
          }
        });


        const tiposVeiculos = [];
        for (const veiculo of veiculos) {

          if (!tiposVeiculos.includes(veiculo.tipo)) {
            tiposVeiculos.push(veiculo.tipo);
          }
        }

        const pessoa = await this.prisma.autenticacao.findFirst({
          where: {
            idConta: conta.idConta
          }
        });

          contasComVeiculos.push({
            conta: { ...conta, email: pessoa.email }, 
            veiculos: tiposVeiculos
          });


      }
      if (Array.isArray(contasComVeiculos) && contasComVeiculos.length === 0) {
        return res.status(404).send("Nenhuma conta encontrada.");
      } else {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Dados');
        worksheet.addRow(["Nome", "WhatsApp", "CEP","Email", "MEI", "ANTT", "Tipo de Veiculo","Veiculos"]);

        contasComVeiculos.forEach(item => {
          const veiculos = item.veiculos.join(', ');
          worksheet.addRow([item.conta.nome, item.conta.contato, item.conta.cep, item.conta.email, item.conta.mei ? "SIM" : "Não", item.conta.antt ? "SIM" : "Não", item.conta.tipoVeiculo == "CargaSeca" ? "Carga Seca" : item.conta.tipoVeiculo, veiculos ? veiculos : "Nenhum"]);
        });


        const buffer = await workbook.xlsx.writeBuffer();

        res.set({
          'Content-Disposition': 'attachment; filename=dados.xlsx',
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Length': Buffer.byteLength(buffer)
        });

        return res.status(200).send(buffer);
      }

    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getVeiculos(id, filters, start, quantity, req, res) {
    try {

      //verificando liberacao
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }


      if (!myData.conta.idAssinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      if ((new Date(assinatura.prazo) < new Date()) || assinatura.status == 'Inativo') {
        return res.status(401).send("Para usufruir deste benefício, é necessário possuir uma assinatura ativa.");
      }

      //recebdo contas ja desbloqueadas pela empresa
      const contasJaDesbloqueadas = await this.prisma.contasdesbloqueadas.findFirst({
        where: {
          idEmpresa: Number(myData.idConta),
          idContato: Number(id)
        },
      });

      if (!contasJaDesbloqueadas) {
        return res.status(404).send("Nenhum contato com esse ID desbloqueado.");
      }

      let contagem = await this.prisma.veiculo.count({
        where: filters
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem;
      }

      filters.idConta = Number(id)
      var veiculosMotorista = await this.prisma.veiculo.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
      });

      if (Array.isArray(veiculosMotorista) && veiculosMotorista.length === 0) {
        return res.status(404).send("Nenhum veiculo encontrada.");
      } else {
        var newData = {
          "veiculosMotorista": veiculosMotorista,
          "count": contagem
        }

        return res.status(200).send(newData);
      }

    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

}

