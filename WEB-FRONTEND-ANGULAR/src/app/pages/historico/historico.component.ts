import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { HotelReservaService, HotelReserva } from '../../services/hotel-reserva.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css',
})
export class HistoricoComponent implements OnInit {
  reservas: Reserva[] = [];
  hotelReservas: HotelReserva[] = [];
  aba: 'onibus' | 'hoteis' = 'onibus';

  carregando = true;
  erro = '';
  precisaLogin = false;
  cancelandoId: number | null = null;
  cancelandoHotelId: number | null = null;
  continuandoId: number | null = null;
  excluindoId: number | null = null;
  excluindoHotelId: number | null = null;
  mensagemPagamento = '';

  constructor(
    private reservaService: ReservaService,
    private hotelReservaService: HotelReservaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tratarRetornoPagamento();
    this.carregar();
  }

  // Confirma o pagamento quando o usuário volta do checkout do Mercado Pago.
  private tratarRetornoPagamento(): void {
    const q = this.route.snapshot.queryParamMap;
    const paymentId = q.get('payment_id') || q.get('collection_id');
    const reservaId = q.get('external_reference');

    if (paymentId && reservaId) {
      this.reservaService.confirmarPagamento(reservaId, paymentId).subscribe({
        next: () => {
          this.mensagemPagamento = 'Pagamento aprovado! Sua passagem está confirmada. ✅';
          this.carregar();
        },
        error: () => {
          this.mensagemPagamento = 'Recebemos seu retorno, mas o pagamento ainda não foi confirmado.';
        },
      });
    }
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
    forkJoin({
      bus: this.reservaService.listar(),
      hotel: this.hotelReservaService.listar(),
    }).subscribe({
      next: ({ bus, hotel }) => {
        this.reservas = bus;
        this.hotelReservas = hotel;
        this.carregando = false;
      },
      error: (err) => {
        this.carregando = false;
        if (err?.status === 401) {
          this.precisaLogin = true;
        } else {
          this.erro = 'Não foi possível carregar suas reservas.';
        }
      },
    });
  }

  // ── Cancelar passagem de ônibus ──
  cancelar(r: Reserva): void {
    if (r.status !== 'confirmada') return;
    if (!confirm(`Cancelar a passagem ${r.codigo} (${r.trip.origin} → ${r.trip.destination})?`)) return;

    this.cancelandoId = r.id;
    this.reservaService.cancelar(r.id).subscribe({
      next: (atualizada) => {
        this.cancelandoId = null;
        const i = this.reservas.findIndex((x) => x.id === r.id);
        if (i >= 0) this.reservas[i] = atualizada;
      },
      error: (err) => {
        this.cancelandoId = null;
        alert(err?.error?.error || 'Erro ao cancelar a passagem.');
      },
    });
  }

  // ── Continuar pagamento pendente ──
  continuarPagamento(r: Reserva): void {
    if (r.status !== 'pendente') return;

    this.continuandoId = r.id;
    this.reservaService.continuarPagamento(r.id).subscribe({
      next: (atualizada) => {
        this.continuandoId = null;
        window.location.href = atualizada.url_pagamento || '';
      },
      error: (err) => {
        this.continuandoId = null;
        alert(err?.error?.error || 'Não foi possível reabrir o pagamento.');
      },
    });
  }

  // ── Excluir passagem do histórico (qualquer status) ──
  excluir(r: Reserva): void {
    if (!confirm(`Excluir a passagem ${r.codigo} (${r.trip.origin} → ${r.trip.destination}) do histórico? Esta ação não pode ser desfeita.`)) return;

    this.excluindoId = r.id;
    this.reservaService.excluir(r.id).subscribe({
      next: () => {
        this.excluindoId = null;
        this.reservas = this.reservas.filter((x) => x.id !== r.id);
      },
      error: (err) => {
        this.excluindoId = null;
        alert(err?.error?.error || 'Não foi possível excluir a passagem.');
      },
    });
  }

  // ── Cancelar reserva de hotel ──
  cancelarHotel(r: HotelReserva): void {
    if (r.status !== 'confirmada') return;
    if (!confirm(`Cancelar a reserva ${r.codigo} no ${r.hotel.name}?`)) return;

    this.cancelandoHotelId = r.id;
    this.hotelReservaService.cancelar(r.id).subscribe({
      next: (atualizada) => {
        this.cancelandoHotelId = null;
        const i = this.hotelReservas.findIndex((x) => x.id === r.id);
        if (i >= 0) this.hotelReservas[i] = atualizada;
      },
      error: (err) => {
        this.cancelandoHotelId = null;
        alert(err?.error?.error || 'Erro ao cancelar a reserva.');
      },
    });
  }

  // ── Excluir reserva de hotel do histórico (qualquer status) ──
  excluirHotel(r: HotelReserva): void {
    if (!confirm(`Excluir a reserva ${r.codigo} no ${r.hotel.name} do histórico? Esta ação não pode ser desfeita.`)) return;

    this.excluindoHotelId = r.id;
    this.hotelReservaService.excluir(r.id).subscribe({
      next: () => {
        this.excluindoHotelId = null;
        this.hotelReservas = this.hotelReservas.filter((x) => x.id !== r.id);
      },
      error: (err) => {
        this.excluindoHotelId = null;
        alert(err?.error?.error || 'Não foi possível excluir a reserva.');
      },
    });
  }
}
