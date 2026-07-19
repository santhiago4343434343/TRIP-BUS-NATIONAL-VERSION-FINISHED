// banner-samba.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner-samba',
  templateUrl: './banner-samba.component.html',
  styleUrls: ['./banner-samba.component.scss']
})
export class BannerSambaComponent implements OnInit, OnDestroy {

  // ── URLs dos anúncios — substitua pelos links reais ─────────
  linkAnuncio1 = 'https://LINK_ANUNCIO_1';
  linkAnuncio2 = 'https://LINK_ANUNCIO_2';

  // ── Controle do slider ───────────────────────────────────────
  slideAtual = 0;

  readonly TOTAL_SLIDES = 4;
  readonly DURACAO_MS   = 5000;

  // Gera array [0,1,2,3] para o *ngFor dos dots no template
  get totalSlidesArray(): number[] {
    return Array.from({ length: this.TOTAL_SLIDES }, (_, i) => i);
  }

  private intervalo: ReturnType<typeof setInterval> | null = null;

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    this.iniciarAutoPlay();
  }

  ngOnDestroy(): void {
    this.pararAutoPlay();
  }

  // ── Navegação ────────────────────────────────────────────────
  goTo(index: number): void {
    this.slideAtual = (index + this.TOTAL_SLIDES) % this.TOTAL_SLIDES;
    this.reiniciarAutoPlay();
  }

  mover(direcao: number): void {
    this.goTo(this.slideAtual + direcao);
  }

  // ── AutoPlay ─────────────────────────────────────────────────
  private iniciarAutoPlay(): void {
    this.intervalo = setInterval(() => {
      this.slideAtual = (this.slideAtual + 1) % this.TOTAL_SLIDES;
    }, this.DURACAO_MS);
  }

  private pararAutoPlay(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private reiniciarAutoPlay(): void {
    this.pararAutoPlay();
    this.iniciarAutoPlay();
  }
}
