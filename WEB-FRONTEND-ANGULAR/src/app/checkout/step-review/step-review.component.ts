import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { loadScript } from "@paypal/paypal-js";

@Component({
  selector: 'app-step-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-review.component.html',
  styleUrls: ['./step-review.component.scss']
})
export class StepReviewComponent implements OnInit, OnChanges {
  @Input() orderData: any;
  @Output() back = new EventEmitter<void>();
  @Output() finish = new EventEmitter<void>();

  listaDePedidos: any[] = [];
  erro: string | null = null;
  paypalRenderizado: boolean = false;

  constructor(
    private pedidoService: PedidoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.listarPedidos();
    }
  }

  // Detecta quando o orderData chega do componente pai
  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId) && changes['orderData'] && this.orderData?.total > 0) {
      if (!this.paypalRenderizado) {
        this.configurarPaypal();
      }
    }
  }

  async configurarPaypal() {
    if (!this.orderData || !this.orderData.total || this.paypalRenderizado) return;

    try {
      const paypal = await loadScript({
        clientId: "EFfLbcAwQAYVgxF48PKtRWDl2uhVMBVb2q_8ryTPxSKAe7wyla5MiQneGbHGRIl69NqJ8E_qtb9TVcYe",
        currency: "USD"
      });

      if (paypal && paypal.Buttons) {
        this.paypalRenderizado = true;
        await paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            const valor = this.orderData?.total?.toString() || "0.00";
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [{
                amount: {
                  value: valor,
                  currency_code: 'USD'
                },
                custom_id: this.orderData.id?.toString() || "0"
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            if (actions.order) {
              await actions.order.capture();
              // Quando aprovado no PayPal, finalizamos com status 'pago'
              this.concluirPedido('pago');
            }
          },
          onError: (err: any) => {
            console.error("Erro no PayPal:", err);
            this.erro = "Erro na renderização do PayPal.";
            this.paypalRenderizado = false;
          }
        }).render("#paypal-button-container");
      }
    } catch (error) {
      console.error("Erro ao carregar o PayPal:", error);
    }
  }

  concluirPedido(statusForçado: string = 'pago'): void {
    if (!this.orderData) {
      alert('⚠️ Dados do pedido não encontrados.');
      return;
    }

    // MONTAGEM CORRETA: Campo 'emailCliente' batendo com o Mailer do Rails
    const dadosParaEnvio = {
      ...this.orderData,
      status: statusForçado,
      emailCliente: 'sb-c9nx148633954@personal.example.com'
    };

    this.pedidoService.finalizarPedido(dadosParaEnvio).subscribe({
      next: (res: any) => {
        console.log('✅ Pedido processado no Rails!', res);
        alert('Compra concluída com sucesso! Verifique seu e-mail.');
        this.finish.emit();
        this.listarPedidos();
      },
      error: (err: any) => {
        console.error("❌ Erro ao salvar no Rails:", err);
        this.erro = "Erro ao conectar com o servidor Rails.";
      }
    });
  }

  listarPedidos(): void {
    this.pedidoService.listarPedidos().subscribe({
      next: (res: any[]) => {
        this.listaDePedidos = res;
      },
      error: (err: any) => console.error("Erro ao listar:", err)
    });
  }

  atualizarStatus(id: number, event: Event): void {
    event.stopPropagation();
    const novoStatus = prompt("Novo status (pendente, pago, cancelado):", "pago");
    if (novoStatus) {
      const statusFormatado = novoStatus.toLowerCase();
      this.pedidoService.atualizarPedido(id, { status: statusFormatado }).subscribe({
        next: () => {
          this.listarPedidos();
          if (statusFormatado === 'pago') {
            alert('E-mail de confirmação disparado!');
          }
        }
      });
    }
  }

  excluir(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm(`Excluir pedido #${id}?`)) {
      this.pedidoService.excluirPedido(id).subscribe({
        next: () => this.listaDePedidos = this.listaDePedidos.filter(p => p.id !== id)
      });
    }
  }
}