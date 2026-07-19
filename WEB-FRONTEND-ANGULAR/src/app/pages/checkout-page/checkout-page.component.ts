import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

// Import dos seus componentes de Step
import { ProgressBarComponent } from '../../checkout/progress-bar/progress-bar.component';
import { StepCartComponent } from '../../checkout/step-cart/step-cart.component';
import { StepAddressComponent } from '../../checkout/step-address/step-address.component';
import { StepDeliveryComponent } from '../../checkout/step-delivery/step-delivery.component';
import { StepPaymentComponent } from '../../checkout/step-payment/step-payment.component';
import { StepReviewComponent } from '../../checkout/step-review/step-review.component';
import { StepCompleteComponent } from '../../checkout/step-complete/step-complete.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, RouterModule,
    ProgressBarComponent, StepCartComponent, StepAddressComponent,
    StepDeliveryComponent, StepPaymentComponent, StepReviewComponent, StepCompleteComponent
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  currentStep = 1;
  rastreio: string | null = null;
  statusPedido: string | null = null;
  isLoading = false;

  // ✅ VARIÁVEIS ADICIONADAS PARA CORRIGIR O ERRO DE COMPILAÇÃO
  urlPagamento: string | null = null;
  paymentMethod: string = '';
  pixCode: string = '';

  orderData: any = {
    cart: [],
    address: {},
    delivery: {},
    payment: { metodo: 'pix' },
    emailCliente: 'santhiago34343434@gmail.com'
  };

  constructor(private http: HttpClient, private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.orderData.cart = this.carrinhoService.obterCarrinho();
  }

  goToStep(step: number): void {
    this.currentStep = step;
    window.scrollTo(0, 0);
  }

  finishOrder(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const payload = { 
      checkout: {
        total: 150.00, 
        status: 'pendente',
        user_id: 1, 
        emailCliente: this.orderData.emailCliente,
        address: JSON.stringify(this.orderData.address),
        cart: JSON.stringify(this.orderData.cart),
        delivery: JSON.stringify(this.orderData.delivery),
        payment: this.orderData.payment?.metodo || 'pix'
      }
    };

    this.http.post<any>('/api/v1/checkouts', payload).subscribe({
      next: (res) => {
        this.paymentMethod = payload.checkout.payment;
        this.urlPagamento = res.url_pagamento || null;
        this.pixCode = res.pix_copia_e_cola || '';

        // Se for Mercado Pago, redireciona direto
        if (this.paymentMethod === 'mercadopago' && this.urlPagamento) {
          window.location.href = this.urlPagamento;
          return;
        }

        // Se for PIX ou outro, vai para a tela de sucesso
        this.rastreio = res.id ? `PED-${res.id}` : 'BR-GERANDO';
        this.statusPedido = res.status || 'pendente';
        this.carrinhoService.limparCarrinho();
        this.goToStep(6);
      },
      error: (err) => {
        console.error('Erro:', err);
        alert('Erro ao processar pedido.');
        this.isLoading = false;
      }
    });
  }
}