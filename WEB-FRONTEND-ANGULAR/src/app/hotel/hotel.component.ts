import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService, Hotel, RoomType } from '../services/hotel.service';
import { HotelReservaService } from '../services/hotel-reserva.service';
import { ImageCarouselComponent } from '../components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageCarouselComponent],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css',
})
export class HotelComponent implements OnInit {
  hotels: Hotel[] = [];
  carregando = true;
  erro = '';
  imagensComErro = new Set<number>();

  // Carrossel de imagens estáticas no topo da página (troque à vontade).
  bannerSlides = [
    { src: 'assets/SAMBAHOTEIS.JPG', titulo: 'Samba Hotéis' },
    { src: 'assets/SAMBAHOTEIS001-BELOHORIZONTE.png', titulo: 'Samba Hotéis - Belo Horizonte' },
    { src: 'assets/angrainn-hotel.jpg', titulo: 'Angra Inn' },
    { src: 'assets/angrainn-hotel001.JPG', titulo: 'Angra Inn - Angra dos Reis' },
    { src: 'assets/angra-dos-reis.jpg', titulo: 'Angra dos Reis' },
    { src: 'assets/intercontinental.avif', titulo: 'InterContinental' },
    { src: 'assets/tangara.jpg', titulo: 'Hotel Tangará' },
    { src: 'assets/marsol-beach-resort.jpg', titulo: 'Marsol Beach Resort' },
  ];

  // ── Modal de reserva ──
  hotelSelecionado: Hotel | null = null;
  hospede = '';
  checkIn = '';
  checkOut = '';
  numHospedes = 1;
  tipoQuarto = 'Standard';
  reservando = false;
  mensagemSucesso = '';
  mensagemErroModal = '';

  hoje = new Date().toISOString().split('T')[0];

  constructor(
    private hotelService: HotelService,
    private hotelReservaService: HotelReservaService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.hotelService.listar().subscribe({
      next: (data) => {
        this.hotels = data;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os hotéis. Verifique se a API (Rails) está no ar.';
        this.carregando = false;
      },
    });
  }

  estaLogado(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  imagemFalhou(h: Hotel): boolean {
    return !h.image_url || this.imagensComErro.has(h.id);
  }

  estrelas(n: number): number[] {
    const q = Math.max(0, Math.min(5, n || 0));
    return Array.from({ length: q }, (_, i) => i + 1);
  }

  // ── Modal ──
  abrirReserva(h: Hotel): void {
    this.hotelSelecionado = h;
    this.hospede = '';
    this.numHospedes = 1;
    this.tipoQuarto = h.room_types?.[0]?.nome || 'Standard';
    this.mensagemSucesso = '';
    this.mensagemErroModal = '';

    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);
    this.checkIn = this.toISO(hoje);
    this.checkOut = this.toISO(amanha);
  }

  fecharReserva(): void {
    this.hotelSelecionado = null;
  }

  private toISO(d: Date): string {
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dia}`;
  }

  get quartoSelecionado(): RoomType | undefined {
    return this.hotelSelecionado?.room_types?.find((q) => q.nome === this.tipoQuarto);
  }

  get noites(): number {
    if (!this.checkIn || !this.checkOut) return 0;
    const ci = new Date(this.checkIn);
    const co = new Date(this.checkOut);
    const diff = Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  get total(): number {
    const diaria = Number(this.quartoSelecionado?.preco_diaria || 0);
    return diaria * this.noites;
  }

  confirmarReserva(): void {
    if (!this.hotelSelecionado) return;

    if (!this.estaLogado()) {
      this.mensagemErroModal = 'Você precisa estar logado para reservar. Faça login e tente novamente.';
      return;
    }
    if (this.noites <= 0) {
      this.mensagemErroModal = 'O check-out deve ser depois do check-in.';
      return;
    }

    this.reservando = true;
    this.mensagemErroModal = '';

    this.hotelReservaService
      .criar({
        hotel_id: this.hotelSelecionado.id,
        hospede: this.hospede,
        tipo_quarto: this.tipoQuarto,
        check_in: this.checkIn,
        check_out: this.checkOut,
        num_hospedes: this.numHospedes,
      })
      .subscribe({
        next: (r) => {
          this.reservando = false;
          this.mensagemSucesso = `Reserva confirmada! Código ${r.codigo}. ${r.noites} noite(s) no ${r.hotel.name}.`;
        },
        error: (err) => {
          this.reservando = false;
          this.mensagemErroModal = err?.error?.error || 'Erro ao reservar. Tente novamente.';
        },
      });
  }
}
