import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TripService, Trip } from '../services/trip.service';
import { ReservaService } from '../services/reserva.service';
import { ImageCarouselComponent } from '../components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageCarouselComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit, OnDestroy {
  trips: Trip[] = [];
  carregando = true;
  erro = '';
  logosComErro = new Set<number>();

  // Carrossel de imagens estáticas no topo da página (troque à vontade).
  bannerSlides = [
    { src: 'assets/Paraty-720x250.jpg', titulo: 'Paraty' },
    { src: 'assets/praia005.jpg', titulo: 'Praia' },
    { src: 'assets/BELO-HORIZONTE.jpg', titulo: 'Belo Horizonte' },
    { src: 'assets/recife.jpg', titulo: 'Recife' },
    { src: 'assets/paraty-riodejaneiro.webp', titulo: 'Paraty - Rio de Janeiro' },
  ];

  // ── Estado do modal de poltronas ──
  viagemSelecionada: Trip | null = null;
  ocupados: number[] = [];
  selecionadas: number[] = [];
  passageiro = '';
  documento = '';
  nascimento = '';
  telefone = '';
  emailViajante = '';
  carregandoMapa = false;
  reservando = false;
  mensagemSucesso = '';
  mensagemErroModal = '';

  // ── Pagamento ──
  metodoPagamento: 'mercadopago' | 'pix' = 'mercadopago';
  pixCopiaCola = '';
  pixQrBase64: string | null = null;
  pixPaymentId: string | number | null = null;
  pixReservaId: number | null = null;
  pixCodigo = '';
  copiado = false;
  private pixPoll: any = null;

  constructor(
    private tripService: TripService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.carregarViagens();
  }

  carregarViagens(): void {
    this.carregando = true;
    this.tripService.listar().subscribe({
      next: (data) => {
        this.trips = data;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as viagens. Verifique se a API (Rails) está no ar.';
        this.carregando = false;
      },
    });
  }

  estaLogado(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  logoFalhou(trip: Trip): boolean {
    return !trip.bus_company_logo || this.logosComErro.has(trip.id);
  }

  // ── Abertura / fechamento do mapa ──
  abrirMapa(trip: Trip): void {
    this.viagemSelecionada = trip;
    this.selecionadas = [];
    this.ocupados = [];
    this.passageiro = '';
    this.documento = '';
    this.nascimento = '';
    this.telefone = '';
    this.emailViajante = '';
    this.mensagemSucesso = '';
    this.mensagemErroModal = '';
    this.metodoPagamento = 'mercadopago';
    this.resetarPix();
    this.carregandoMapa = true;

    this.tripService.buscar(trip.id).subscribe({
      next: (detalhe) => {
        this.viagemSelecionada = detalhe;
        this.ocupados = detalhe.assentos_ocupados || [];
        this.carregandoMapa = false;
      },
      error: () => {
        this.mensagemErroModal = 'Erro ao carregar o mapa de poltronas.';
        this.carregandoMapa = false;
      },
    });
  }

  fecharMapa(): void {
    this.resetarPix();
    this.viagemSelecionada = null;
  }

  // ── Poltronas ──
  get assentos(): number[] {
    const total = this.viagemSelecionada?.total_seats || 44;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get fileiras(): number[][] {
    const todas = this.assentos;
    const linhas: number[][] = [];
    for (let i = 0; i < todas.length; i += 4) {
      linhas.push(todas.slice(i, i + 4));
    }
    return linhas;
  }

  estaOcupado(n: number): boolean {
    return this.ocupados.includes(n);
  }

  estaSelecionado(n: number): boolean {
    return this.selecionadas.includes(n);
  }

  alternarAssento(n: number): void {
    if (this.estaOcupado(n)) return;
    if (this.estaSelecionado(n)) {
      this.selecionadas = this.selecionadas.filter((x) => x !== n);
    } else {
      this.selecionadas = [...this.selecionadas, n].sort((a, b) => a - b);
    }
  }

  get total(): number {
    const preco = Number(this.viagemSelecionada?.price || 0);
    return preco * this.selecionadas.length;
  }

  confirmarReserva(): void {
    if (!this.viagemSelecionada) return;

    if (!this.estaLogado()) {
      this.mensagemErroModal = 'Você precisa estar logado para reservar. Faça login e tente novamente.';
      return;
    }
    if (this.selecionadas.length === 0) {
      this.mensagemErroModal = 'Selecione ao menos uma poltrona.';
      return;
    }
    if (!this.passageiro.trim() || !this.documento.trim() || !this.nascimento || !this.telefone.trim()) {
      this.mensagemErroModal = 'Preencha os dados do viajante (nome, CPF, nascimento e telefone).';
      return;
    }

    this.reservando = true;
    this.mensagemErroModal = '';

    this.reservaService
      .criar({
        trip_id: this.viagemSelecionada.id,
        passageiro: this.passageiro,
        documento: this.documento,
        nascimento: this.nascimento,
        telefone: this.telefone,
        email: this.emailViajante,
        poltronas: this.selecionadas,
        payment: this.metodoPagamento,
      })
      .subscribe({
        next: (reserva: any) => {
          this.reservando = false;

          // PIX: mostra o QR Code e fica consultando o status até aprovar.
          if (reserva.pix_copia_e_cola) {
            this.pixReservaId = reserva.id;
            this.pixCodigo = reserva.codigo;
            this.pixPaymentId = reserva.pix_payment_id;
            this.pixCopiaCola = reserva.pix_copia_e_cola;
            this.pixQrBase64 = reserva.pix_qr_base64 || null;
            this.iniciarPollingPix();
            return;
          }

          // Mercado Pago (cartão): redireciona para o checkout.
          if (reserva.url_pagamento) {
            window.location.href = reserva.url_pagamento;
            return;
          }
          if (reserva.erro_pagamento) {
            this.mensagemErroModal =
              'Reserva criada, mas falhou ao gerar o pagamento: ' + reserva.erro_pagamento;
            return;
          }
          this.mensagemSucesso = `Passagem reservada! Código ${reserva.codigo}. Poltrona(s): ${reserva.poltronas.join(', ')}.`;
          this.ocupados = [...this.ocupados, ...this.selecionadas];
          this.selecionadas = [];
          this.carregarViagens();
        },
        error: (err) => {
          this.reservando = false;
          this.mensagemErroModal = err?.error?.error || 'Erro ao reservar. Tente novamente.';
        },
      });
  }

  // ── PIX ──
  private iniciarPollingPix(): void {
    this.pararPollingPix();
    let tentativas = 0;
    this.pixPoll = setInterval(() => {
      if (!this.pixReservaId || !this.pixPaymentId) return;
      if (++tentativas > 40) { this.pararPollingPix(); return; } // desiste após ~3 min
      this.reservaService.confirmarPagamento(this.pixReservaId, String(this.pixPaymentId)).subscribe({
        next: (reserva) => {
          if (reserva && reserva.status === 'confirmada') {
            this.pararPollingPix();
            const poltronas = [...this.selecionadas];
            this.mensagemSucesso = `Pagamento PIX confirmado! Código ${this.pixCodigo}. Poltrona(s): ${poltronas.join(', ')}.`;
            this.pixCopiaCola = '';
            this.ocupados = [...this.ocupados, ...poltronas];
            this.selecionadas = [];
            this.carregarViagens();
          }
        },
        error: () => { /* ainda pendente; segue tentando */ },
      });
    }, 5000);
  }

  private pararPollingPix(): void {
    if (this.pixPoll) { clearInterval(this.pixPoll); this.pixPoll = null; }
  }

  copiarPix(): void {
    if (!this.pixCopiaCola) return;
    navigator.clipboard?.writeText(this.pixCopiaCola).then(() => {
      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2000);
    });
  }

  private resetarPix(): void {
    this.pararPollingPix();
    this.pixCopiaCola = '';
    this.pixQrBase64 = null;
    this.pixPaymentId = null;
    this.pixReservaId = null;
    this.pixCodigo = '';
    this.copiado = false;
  }

  ngOnDestroy(): void {
    this.pararPollingPix();
  }
}
