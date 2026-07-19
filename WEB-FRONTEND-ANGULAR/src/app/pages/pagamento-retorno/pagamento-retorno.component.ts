import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';

// Página para onde o Mercado Pago redireciona após o checkout do cartão.
// Lê o status na URL (?status=approved&payment_id=...&external_reference=...),
// confirma no backend e mostra a tela de aprovado / pendente / recusado.
@Component({
  selector: 'app-pagamento-retorno',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagamento-retorno.component.html',
})
export class PagamentoRetornoComponent implements OnInit {
  estado: 'carregando' | 'aprovado' | 'pendente' | 'recusado' = 'carregando';
  codigo = '';

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((p) => {
      const status = (p['status'] || p['collection_status'] || '').toString();
      const paymentId = (p['payment_id'] || p['collection_id'] || '').toString();
      const reservaId = (p['external_reference'] || '').toString();

      if (status === 'approved') {
        this.estado = 'aprovado';
        // Confirma no backend (marca a reserva como "confirmada" e pega o código).
        if (reservaId && paymentId) {
          this.reservaService.confirmarPagamento(reservaId, paymentId).subscribe({
            next: (r) => (this.codigo = r?.codigo || ''),
            error: () => {},
          });
        }
      } else if (status === 'pending' || status === 'in_process') {
        this.estado = 'pendente';
      } else if (!status) {
        // Acesso direto, sem parâmetros: trata como pendente (neutro).
        this.estado = 'pendente';
      } else {
        this.estado = 'recusado';
      }
    });
  }
}
