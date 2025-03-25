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

@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly geralFunctions: functionService,
    private readonly authFunctions: AuthFunctions,
    private readonly notificationsGateway: NotificationsGateway
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
      if (myData.conta.idAssinatura) {
        const assinatura = await this.prisma.assinatura.findFirst({
          where: {
            idAssinatura: Number(myData.conta.idAssinatura)
          }
        })

        if (!assinatura) {
          return res.status(404).send("Não encontramos seus dados no sistema.");
        }

        assinaturaUsuario = myData.conta.idAssinatura;

        if (assinatura.plano.toLowerCase() == dadosPlano.nome.toLocaleLowerCase()){
          if(assinatura.codPagamento && assinatura.idPagamentoFrete && assinatura.status == 'Ativo')
          return res.status(400).send("Você já possui uma assinatura com este plano.")
        }

        if (assinatura.codPagamento) {
          return res.status(400).send("Você já possui um pedido para assinar.");
        }
      }

      if (dadosAssinatura.qtdeMeses != 6 && dadosAssinatura.qtdeMeses != 1 && dadosAssinatura.qtdeMeses != 3) {
        dadosAssinatura.qtdeMeses = 1;
      }

      let valor
      
      if (dadosAssinatura.qtdeMeses == 1) {
        valor = dadosPlano.valorMensal
      } else if (dadosAssinatura.qtdeMeses == 3) {
        valor = dadosPlano.valorTrimestral * 3
      } else {
        valor = dadosPlano.valorTrimestral * 6
      }

      if (dadosAssinatura.usarDesconto){
        if(myData.conta.idDesconto){
          let desconto = await this.prisma.desconto.findFirst({
            where: {
              idDesconto: Number(myData.conta.idDesconto)
            }
          })
  
          if (desconto){
            if (Number(desconto.valor) >= Number(valor)){
              let diferenca = Number(desconto.valor) - Number(valor)
      
              await this.prisma.desconto.update({
                data: {
                  valor: Number(diferenca)
                },
                where: {
                  idDesconto: Number(desconto.idDesconto)
                }
              })

              const assinaturaNovo = await this.prisma.assinatura.findFirst({
                where: {
                  idAssinatura: Number(myData.conta.idAssinatura)
                }
              })
              let qtdeFretesNovo = Number(assinaturaNovo.qtdeFretes)
              qtdeFretesNovo = qtdeFretesNovo + Number(dadosPlano.qtdeFrete)

              let qtdeContatosNovo = Number(assinaturaNovo.qtdeContatos)
              qtdeContatosNovo = qtdeContatosNovo + Number(dadosPlano.qtdeContatos)
              const dataExpiracao = addMonths(new Date(), Number(dadosAssinatura.qtdeMeses));
              await this.prisma.assinatura.update({
                where: {
                  idAssinatura: Number(myData.conta.idAssinatura)
                },
                data: {
                  qtdeContatos: qtdeContatosNovo,
                  qtdeFretes: qtdeFretesNovo,
                  plano: dadosPlano.nome,
                  prazo: dataExpiracao
                }
              })

              return res.status(200).send({
                "compra": "Sua compra foi aprovada e descontamos do seu saldo."
              })
            }else{
              valor = Number(valor) - Number(desconto.valor)
            }
            
          }
        }
      }
    

      const client = new MercadoPagoConfig({ accessToken: process.env.SECRET_MERCADOPAGO });
      const preference = new Preference(client);

      preference.create({
        body: {
          items: [
            {
              id: dadosPlano.idPlanos.toString(),
              title: dadosPlano.nome,
              quantity: 1,
              unit_price: valor
            }
          ],
          external_reference: JSON.stringify({
            userId: myData.idConta,
            qtdeMeses: dadosAssinatura.qtdeMeses,
            planId: dadosPlano.idPlanos,
            qtdeFretes: dadosPlano.qtdeFrete,
            qtdeContatos: dadosPlano.qtdeContatos,
            tipo: "assinatura"
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
          if (!myData.conta.idAssinatura) {
            const assinaturaCriada = await this.prisma.assinatura.create({
              data: {
                status: 'Inativo',
                ultimoMes: new Date(),
                plano: 'criado',
                qtdeContatos: 0,
                qtdeFretes: 0,
                prazo: new Date()

              }
            });

            await this.prisma.contas.update({
              where: {
                idConta: Number(myData.conta.idConta)
              },
              data: {
                idAssinatura: Number(assinaturaCriada.idAssinatura)
              }
            })
          }
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

  async getPlano(req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }
      const assinatura = await this.prisma.assinatura.findFirst({
        where: {
          idAssinatura: Number(myData.conta.idAssinatura)
        }
      })

      if (!assinatura) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      let frete, pagAssinatura

      if (assinatura.idPagamentoFrete){
        const responseFrete = await axios.get(`https://api.mercadopago.com/v1/payments/${assinatura.idPagamentoFrete}`, {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_MERCADOPAGO}`
          }
        });
        const paymentDataFrete = responseFrete.data;
        let status = paymentDataFrete.status;
        switch (status) {
          case 'approved':
            frete = 'Pagamento aprovado.';
            break;
          case 'pending':
            frete = 'Pagamento pendente. Por favor, aguarde a confirmação.';
            break;
          case 'in_process':
            frete = 'Pagamento em processo de revisão.';
            break;
          case 'rejected':
            frete = 'Pagamento rejeitado. Por favor, tente outro método de pagamento.';
            break;
          case 'cancelled':
            frete = 'Pagamento cancelado.';
            break;
          case 'refunded':
            frete = 'Pagamento reembolsado.';
            break;
          case 'charged_back':
            frete = 'Pagamento devolvido devido a uma contestação.';
            break;
          default:
            frete = 'Status de pagamento desconhecido. Por favor, entre em contato com o suporte.';
            break;
        }
      }

      if (assinatura.codPagamento){
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
     

      if(!frete && !pagAssinatura){
        return res.status(404).send("Nenhum pagamento pendente.");
      }
     
      const data = {
        "frete": frete,
        "assinatura": pagAssinatura
      }
     
      return res.status(200).send(data)
     
 
    } catch (error) {
      return res.status(400).send("Estamos aguardando seu pagamento.");
    }


  }

  async createFrete(usarDesconto, req, res) {
    try {
      const myData = await this.authFunctions.getMyData(req);
      if (!myData) {
        return res.status(404).send("Não encontramos seus dados no sistema.");
      }

      const dadosFrete = await this.prisma.geral.findFirst()

      if (!dadosFrete) {
        return res.status(404).send("Não encontramos o valor do frete no sistema.");
      }

      let assinaturaUsuario
      if (myData.conta.idAssinatura) {
        const assinatura = await this.prisma.assinatura.findFirst({
          where: {
            idAssinatura: Number(myData.conta.idAssinatura)
          }
        })

        if (!assinatura) {
          return res.status(404).send("Não encontramos seus dados no sistema.");
        }

        assinaturaUsuario = myData.conta.idAssinatura;

        if (assinatura.qtdeFretes > 0) {
          return res.status(400).send("Você ainda possui fretes para usar..");
        }

        if (assinatura.idPagamentoFrete){
          return res.status(400).send("Você tem um pedido de fretes ativo.");
        }
      }else{
        return res.status(400).send("Você precisa ter uma assinatura ativa para utilizar desse recurso");
      }

      const client = new MercadoPagoConfig({ accessToken: process.env.SECRET_MERCADOPAGO });
      const preference = new Preference(client);
      let valor = Number(dadosFrete.valorFreteIndividual)
      if (usarDesconto){
        if(myData.conta.idDesconto){
          let desconto = await this.prisma.desconto.findFirst({
            where: {
              idDesconto: Number(myData.conta.idDesconto)
            }
          })
  
          if (desconto){
            if (Number(desconto.valor) >= Number(valor)){
              let diferenca = Number(desconto.valor) - Number(valor)
      
              await this.prisma.desconto.update({
                data: {
                  valor: Number(diferenca)
                },
                where: {
                  idDesconto: Number(desconto.idDesconto)
                }
              })

              const assinaturaNovo = await this.prisma.assinatura.findFirst({
                where: {
                  idAssinatura: Number(myData.conta.idAssinatura)
                }
              })

              let qtdeFretesNovo = Number(assinaturaNovo.qtdeFretes)
              qtdeFretesNovo = qtdeFretesNovo + 1

              await this.prisma.assinatura.update({
                where: {
                  idAssinatura: Number(myData.conta.idAssinatura)
                },
                data: {
                  qtdeFretes: qtdeFretesNovo,
                }
              })

              return res.status(200).send({
                "compra": "Sua compra foi aprovada e descontamos do seu saldo."
              })
            }else{
              valor = Number(valor) - Number(desconto.valor)
            }
            
          }
        }
      }
      preference.create({
        body: {
          items: [
            {
              id: dadosFrete.idGeral.toString(),
              title: "Frete individual",
              quantity: 1,
              unit_price: valor
            }
          ],
          external_reference: JSON.stringify({
            userId: myData.idConta,
            tipo: "frete"
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


  async handleStripeWebhook(eventData: any, queryParams, res) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      if (eventData.type == 'payment' || eventData.topic == 'payment') {
        let accountId, planId, tipo, qtdeMeses, status
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
            if (tipo == "assinatura"){
              planId = externalReference.planId;
              qtdeMeses = externalReference.qtdeMeses; 
            }
            accountId = externalReference.userId;
            status = paymentData.status;

            switch (eventData.action) {
              case 'payment.created':
    
                const contaCriada = await this.prisma.contas.findFirst({
                  where: {
                    idConta: Number(accountId)
                  }
                });
    
                const assinaturaCriada = await this.prisma.assinatura.findFirst({
                  where: {
                    idAssinatura: Number(contaCriada.idAssinatura)
                  },
                });

                
                const notificationCriada = {
                  "tipo": "criado",
                  "pagamento": "Recebemos seu pedido, aguarde."
                };
        
                this.notificationsGateway.sendNotification(accountId, notificationCriada);

                if (tipo == 'assinatura') {
                  await this.prisma.assinatura.update({
                    where: {
                      idAssinatura: Number(contaCriada.idAssinatura)
                    },
                    data: {
                      codPagamento: paymentId
                    }
                  })
                }else{
                  await this.prisma.assinatura.update({
                    where: {
                      idAssinatura: Number(contaCriada.idAssinatura)
                    },
                    data: {
                      qtdeFretes: 1,
                      idPagamentoFrete: paymentId,
                    }
                  })
                }
                break;
              case 'payment.updated':
    
                if (status === 'approved') {
                  const conta = await this.prisma.contas.findFirst({
                    where: {
                      idConta: Number(accountId)
                    }
                  });
    
                  const assinatura = await this.prisma.assinatura.findFirst({
                    where: {
                      idAssinatura: Number(conta.idAssinatura)
                    },
                  });
                  if (tipo == 'assinatura') {
    
                    const dadosPlano = await this.prisma.planos.findFirst({
                      where: {
                        idPlanos: Number(planId)
                      }
                    })
                    const dataExpiracao = addMonths(new Date(), Number(qtdeMeses));
                    let qtdeFretestotal = Number(assinatura.qtdeFretes) + Number(dadosPlano.qtdeFrete)
                    let qtdeContatostotal = Number(assinatura.qtdeContatos) + Number(dadosPlano.qtdeContatos)
                    await this.prisma.assinatura.update({
                      where: {
                        idAssinatura: Number(conta.idAssinatura)
                      },
                      data: {
                        plano: dadosPlano.nome,
                        status: 'Ativo',
                        ultimoMes: new Date(),
                        qtdeContatos: Number(qtdeContatostotal),
                        qtdeFretes: Number(qtdeFretestotal),
                        prazo: dataExpiracao,
                        codPagamento: null
                      }
                    })

                    const notificationData = {
                      "tipo": "assinatura",
                      qtdeContatos: qtdeContatostotal,
                      qtdeFretes: qtdeFretestotal,
                      status: "Ativo",
                      prazo: dataExpiracao,
                    };
            
                    this.notificationsGateway.sendNotification(accountId, notificationData);
                  } else {
                    await this.prisma.assinatura.update({
                      where: {
                        idAssinatura: Number(conta.idAssinatura)
                      },
                      data: {
                        qtdeFretes: 1,
                        idPagamentoFrete: null,
                      }
                    })
                    
                    const notificationDataFrete = {
                      tipo: "frete",
                      qtdeFretes: 1,
                    };
            
                    this.notificationsGateway.sendNotification(accountId, notificationDataFrete);
                  }
    
                }
                break;
              case 'payment.cancelled':
    
                const conta = await this.prisma.contas.findFirst({
                  where: {
                    idConta: Number(accountId)
                  }
                });
    
                const assinatura = await this.prisma.assinatura.findFirst({
                  where: {
                    idAssinatura: Number(conta.idAssinatura)
                  },
                });
    
                if (assinatura.prazo && new Date() > assinatura.prazo) {
    
                  await this.prisma.assinatura.update({
                    where: {
                      idAssinatura: Number(conta.idAssinatura)
                    },
                    data: {
                      status: 'Inativo',
                    }
                  })
                }
                if (tipo == 'frete'){
                  await this.prisma.assinatura.update({
                    where: {
                      idAssinatura: Number(conta.idAssinatura)
                    },
                    data: {
                      qtdeFretes: 1,
                      idPagamentoFrete: null,
                    }
                  })
                }
    
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

