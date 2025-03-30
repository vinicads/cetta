import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import path from 'path';
import { functionService } from 'src/middlewares/geralFunctions';
import Stripe from 'stripe';
import { AuthFunctions } from 'src/middlewares/auth.middleware';
import { DadosAssinaturaDTO } from './dto/dadosAssinatura.dto';
import { addMonths } from 'date-fns';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { NotificationsGateway } from '../websocket/websocket';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AssinaturasService } from 'src/services/assinaturas.service';

@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly assinaturaService: AssinaturasService,
    @InjectQueue('geral') private readonly geralQueue: Queue
  ) {

  }

  async create(dadosAssinatura: DadosAssinaturaDTO, req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);

      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const dadosPlano = await this.prisma.planos.findFirst({
        where: {
          idPlanos: Number(dadosAssinatura.idPlanos)
        }
      })

      if (!dadosPlano) {
        return res.status(404).send("Não encontramos o plano no sistema.");
      }

      let assinaturaUsuario
      let desconto
      const assinatura = await this.assinaturaService.get(myData.idConta, dadosPlano.idPlanos)

      if (assinatura) {
        assinaturaUsuario = assinatura.idAssinatura;
        if (assinatura.idPlanos == dadosPlano.idPlanos) {
          if (assinatura.ativo == true)
            return res.status(400).send("Você já possui uma assinatura com este plano.")
        }

        if (assinatura.codPagamento) {
          return res.status(400).send("Você já possui um pedido em aberto para assinar.");
        }

      }


      const contagemGrupo = await this.prisma.grupoConta.count({
        where: {
          idGrupo: Number(dadosAssinatura.idGrupo)
        }
      });

      if (contagemGrupo >= dadosPlano.qtdePessoas) {
        return res.status(401).send("O grupo selecionado não possui mais espaço.");
      }

      if (!assinatura) {
        await this.assinaturaService.create(myData.idConta, dadosPlano.idPlanos, false);
      }



      if (dadosAssinatura.idGrupo) {
        let gruposContasExists = await this.prisma.grupoConta.findFirst({
          where: {
            idConta: Number(myData.idConta),
            idGrupo: Number(dadosAssinatura.idGrupo)
          }
        })

        const dadosGrupo = await this.prisma.grupos.findFirst({
          where: {
            idGrupo: Number(dadosAssinatura.idGrupo)
          }
        });

        if (dadosGrupo.idPlanos != dadosAssinatura.idPlanos) {
          return res.status(400).send("O grupo selecionado não está incluido nessa assinatura.");
        }

        if (!gruposContasExists) {
          await this.prisma.grupoConta.create({
            data: {
              idConta: Number(myData.idConta),
              idGrupo: Number(dadosAssinatura.idGrupo)
            }
          })
        } else {
          return res.status(400).send("Você já faz parte desse grupo.");
        }
      }

      const client = new MercadoPagoConfig({ accessToken: process.env.SECRET_MERCADOPAGO });
      const preference = new Preference(client);
      const nomeCompleto = myData.conta.nome.trim();
      const partes = nomeCompleto.split(" ");

      const name = partes[0];
      const surname = partes.length > 1 ? partes.slice(1).join(" ") : name;

      preference.create({
        body: {
          items: [
            {
              id: dadosPlano.idPlanos.toString(),
              title: dadosPlano.nome,
              description: dadosPlano.descricao,
              category_id: 'services',
              quantity: 1,
              unit_price: dadosPlano.valorTotal
            }
          ],
          payer:
          {
            name: name,
            surname: surname
          }
          ,
          external_reference: JSON.stringify({
            userId: myData.idConta,
            planId: dadosPlano.idPlanos,
            gruopId: dadosAssinatura.idGrupo
          }),
          back_urls: {
            success: process.env.mydomainWorld,
            failure: process.env.mydomainWorld,
            pending: process.env.mydomainWorld,
          },
          payment_methods: {
            excluded_payment_methods: [],
            excluded_payment_types: []
          },
        }
      })
        .then(async (response) => {

          const paymentId = response.id;


          const paymentUrl = response.init_point;

          return res.status(200).send({ urL: paymentUrl });
        })
        .catch((error) => {
          return res.status(400).send("Dados incorretos.");
        });




    } catch (error) {
      console.log(error)
      return res.status(400).send("Dados incorretos.");
    }
  }

  async getPlano(idPlanos: number, req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const assinatura = await this.assinaturaService.get(myData.idConta, idPlanos)

      if (!assinatura) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      let pagAssinatura


      if (assinatura.codPagamento) {
        const responseAssinatura = await axios.get(`https://api.mercadopago.com/v1/payments/${assinatura.codPagamento}`, {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_MERCADOPAGO}`
          }
        });
        const paymentDataAssinatura = responseAssinatura.data;
        let statusPag = paymentDataAssinatura.status;
        switch (statusPag) {
          case 'approved':
            pagAssinatura = 'Pagamento aprovado.';
            break;
          case 'pending':
            pagAssinatura = 'Pagamento pendente. Por favor, aguarde a confirmação.';
            break;
          case 'in_process':
            pagAssinatura = 'Pagamento em processo de revisão.';
            break;
          case 'rejected':
            pagAssinatura = 'Pagamento rejeitado. Por favor, tente outro método de pagamento.';
            break;
          case 'cancelled':
            pagAssinatura = 'Pagamento cancelado.';
            break;
          case 'refunded':
            pagAssinatura = 'Pagamento reembolsado.';
            break;
          case 'charged_back':
            pagAssinatura = 'Pagamento devolvido devido a uma contestação.';
            break;
          default:
            pagAssinatura = 'Status de pagamento desconhecido. Por favor, entre em contato com o suporte.';
            break;
        }
      }


      if (!pagAssinatura) {
        return res.status(404).send("Nenhum pagamento pendente.");
      }

      const data = {
        "assinatura": pagAssinatura
      }

      return res.status(200).send(data)


    } catch (error) {
      return res.status(400).send("Estamos aguardando seu pagamento.");
    }


  }


  async handleStripeWebhook(eventData: any, queryParams, res) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      if (eventData.type == 'payment' || eventData.topic == 'payment') {
        let accountId, planId, tipo, status, gruopId
        let paymentId = eventData.data;
        if (paymentId.id) {

          try {
            paymentId = paymentId.id;
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              headers: {
                Authorization: `Bearer ${process.env.SECRET_MERCADOPAGO}`
              }
            });

            const paymentData = response.data;
            const externalReference = JSON.parse(paymentData.external_reference);
            tipo = externalReference.tipo;
            planId = externalReference.planId;
            gruopId = externalReference.gruopId;
            accountId = externalReference.userId;
            status = paymentData.status;
            const contaInfo = await this.prisma.contas.findFirst({
              where: {
                idConta: Number(accountId)
              }
            });
            const dadosPlano = await this.prisma.planos.findFirst({
              where: {
                idPlanos: Number(planId)
              }
            })
            switch (eventData.action) {
              case 'payment.created':

                const assinaturaCriada = await this.assinaturaService.get(contaInfo.idConta, planId);

                const notificationCriada = {
                  "tipo": "criado",
                  "pagamento": "Recebemos seu pedido, aguarde."
                };

                this.notificationsGateway.sendNotification(accountId, notificationCriada);

                await this.prisma.assinatura.update({
                  where: {
                    idAssinatura: Number(assinaturaCriada.idAssinatura)
                  },
                  data: {
                    codPagamento: paymentId
                  }
                })

                break;
              case 'payment.updated':

                if (status === 'approved') {
                  const conta = await this.prisma.contas.findFirst({
                    where: {
                      idConta: Number(accountId)
                    }
                  });

                  const autenticacao = await this.prisma.autenticacao.findFirst({
                    where: {
                      idConta: Number(accountId)
                    }
                  })

                  const assinatura = await this.assinaturaService.get(contaInfo.idConta, planId);



                  await this.prisma.assinatura.update({
                    where: {
                      idAssinatura: Number(assinatura.idAssinatura)
                    },
                    data: {
                      ativo: true,
                      ultimo_update: new Date(),
                      codPagamento: null
                    }
                  })

                  await this.prisma.contas.update({
                    data: {
                      fagerstrom: true
                    },
                    where: {
                      idConta: conta.idConta
                    }
                  })

                  let jobData = {
                    nome: conta.nome,
                    telefone: conta.celular,
                    email: autenticacao.email,
                  };

                  await this.geralQueue.add('sendMedico', {
                    jobData
                  });

                  let jobdataPagamento = {
                    mensagem: "Recebemos seu pagamento! Entre no sistema para verificar o início das sessões e comece seu tratamento!",
                    nomePlano: dadosPlano.nome,
                    valorTotal: dadosPlano.valorTotal,
                    email: autenticacao.email,
                  };

                  await this.geralQueue.add('pagamento', {
                    jobData: jobdataPagamento
                  });

                  await this.prisma.historicoPagamento.create({
                    data: {
                      nome: dadosPlano.nome,
                      descricao: dadosPlano.subtitulo,
                      valorTotal: dadosPlano.valorTotal,
                      data_inicio: new Date(),
                      idConta: conta.idConta,
                      pago: true
                    }
                  })

                  const notificationData = {
                    tipo: "pago",
                    ativo: true,
                  };

                  this.notificationsGateway.sendNotification(accountId, notificationData);

                }
                break;
              case 'payment.cancelled':

                const conta = await this.prisma.contas.findFirst({
                  where: {
                    idConta: Number(accountId)
                  }
                });

                const autenticacao = await this.prisma.autenticacao.findFirst({
                  where: {
                    idConta: Number(accountId)
                  }
                })

                const assinatura = await this.assinaturaService.get(contaInfo.idConta, planId);

                await this.prisma.assinatura.update({
                  where: {
                    idAssinatura: Number(assinatura.idAssinatura)
                  },
                  data: {
                    ativo: false,
                    codPagamento: null
                  }
                })

                await this.prisma.grupoConta.deleteMany({
                  where: {
                    idGrupo: Number(gruopId),
                    idConta: Number(conta.idConta)
                  }
                })

                await this.prisma.historicoPagamento.create({
                  data: {
                    nome: dadosPlano.nome,
                    descricao: dadosPlano.subtitulo,
                    valorTotal: dadosPlano.valorTotal,
                    data_inicio: new Date(),
                    idConta: conta.idConta,
                    pago: false
                  }
                })

                let jobdataPagamento = {
                  mensagem: "Olá, infelizmente seu pagamento não foi confirmado. Caso ainda tenha interesse de realizar o tratamento, tente realizar a compra da assinatura mais uma vez!",
                  nomePlano: dadosPlano.nome,
                  valorTotal: dadosPlano.valorTotal,
                  email: autenticacao.email,
                };

                await this.geralQueue.add('pagamento', {
                  jobData: jobdataPagamento
                });

                const notificationDataFrete = {
                  tipo: "cancelado",
                };

                this.notificationsGateway.sendNotification(accountId, notificationDataFrete);

                break;
              default:

                break;
            }

          } catch (error) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

}


