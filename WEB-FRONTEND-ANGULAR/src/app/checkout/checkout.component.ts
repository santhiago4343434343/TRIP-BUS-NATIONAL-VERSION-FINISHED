import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Componentes dos Steps
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { StepCartComponent } from './step-cart/step-cart.component';
import { StepAddressComponent } from './step-address/step-address.component';
import { StepDeliveryComponent } from './step-delivery/step-delivery.component';
import { StepPaymentComponent } from './step-payment/step-payment.component';
import { StepReviewComponent } from './step-review/step-review.component';
import { StepCompleteComponent } from './step-complete/step-complete.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ProgressBarComponent,
    StepCartComponent,
    StepAddressComponent,
    StepDeliveryComponent,
    StepPaymentComponent,
    StepReviewComponent,
    StepCompleteComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: [] 
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  
  // Estrutura de dados completa para o Rails
  orderData: any = {
    total: 150, // Exemplo: idealmente viria do seu serviço de carrinho
    user_id: 1, 
    status: 'pendente',
    emailCliente: '',
    address: {},
    cart: [],
    delivery: {},
    payment: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Tente carregar o carrinho do localStorage ou do seu serviço aqui se necessário
  }

  setAddress(event: any) {
    this.orderData.address = event;
    this.currentStep = 3;
  }

  setDelivery(event: any) {
    this.orderData.delivery = event;
    this.currentStep = 4;
  }

  setPayment(event: any) {
    // Captura o método (ex: 'mercadopago' ou 'pix')
    this.orderData.payment = event.method || event; 
    this.currentStep = 5;
  }

  // FUNÇÃO QUE CONECTA COM O RAILS
  finalizarPedido() {
    // Prepara o objeto exatamente como o Rails espera receber
    const payload = {
      checkout: {
        total: this.orderData.total,
        user_id: this.orderData.user_id,
        status: 'pendente',
        payment: this.orderData.payment,
        // Convertendo objetos para String JSON para o Rails salvar sem erro
        address: JSON.stringify(this.orderData.address),
        cart: JSON.stringify(this.orderData.cart),
        delivery: JSON.stringify(this.orderData.delivery)
      }
    };

    console.log('Enviando pedido...', payload);

    this.http.post<any>('/api/v1/checkouts', payload)
      .subscribe({
        next: (res) => {
          console.log('Resposta do Servidor:', res);

          // SE FOR MERCADO PAGO, REDIRECIONA
          if (res.url_pagamento) {
            window.location.href = res.url_pagamento;
          } else {
            // Se for PIX ou outro, apenas avança para o step final
            this.currentStep = 6;
          }
        },
        error: (err) => {
          console.error('Erro ao finalizar:', err);
          alert('Erro ao processar pedido no servidor Rails.');
        }
      });
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
}