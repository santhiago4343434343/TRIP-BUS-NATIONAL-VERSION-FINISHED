import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservaService, Reserva } from '../../services/reserva.service';

@Component({
  selector: 'app-cancelamentos',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cancelamentos.component.html',
  styleUrls: ['./cancelamentos.component.scss'],
})
export class CancelamentosComponent implements OnInit {
  reservas: Reserva[] = []; // apenas confirmadas (canceláveis)
  carregando = true;
  erro = '';
  precisaLogin = false;
  cancelandoId: number | null = null;
  mensagemSucesso = '';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  estaLogado(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  carregar(): void {
    if (!this.estaLogado()) {
      this.precisaLogin = true;
      this.carregando = false;
      return;
    }

    this.carregando = true;
    this.reservaService.listar().subscribe({
      next: (dados) => {
        this.reservas = dados.filter((r) => r.status === 'confirmada');
        this.carregando = false;
      },
      error: (err) => {
        this.carregando = false;
        if (err?.status === 401) {
          this.precisaLogin = true;
        } else {
          this.erro = 'Não foi possível carregar suas passagens.';
        }
      },
    });
  }

  cancelar(r: Reserva): void {
    if (!confirm(`Confirmar cancelamento da passagem ${r.codigo}?`)) return;

    this.cancelandoId = r.id;
    this.erro = '';
    this.reservaService.cancelar(r.id, 'Cancelamento via portal').subscribe({
      next: () => {
        this.cancelandoId = null;
        this.reservas = this.reservas.filter((x) => x.id !== r.id);
        this.mensagemSucesso = `Passagem ${r.codigo} cancelada com sucesso. O estorno será processado.`;
      },
      error: (err) => {
        this.cancelandoId = null;
        this.erro = err?.error?.error || 'Erro ao processar o cancelamento.';
      },
    });
  }
}
