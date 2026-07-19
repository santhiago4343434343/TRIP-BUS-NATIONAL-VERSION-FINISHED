// banner-samba.component.ts — STANDALONE (Angular 17+)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideAcessoComponent } from './slide-acesso.component';
import { SlideLogoComponent } from './slide-logo.component';
import { SlideExtremaComponent } from './slide-extrema.component';
import { SlideRotaComponent } from './slide-rota.component';

@Component({
  selector: 'app-banner-samba',
  standalone: true,
  imports: [
    CommonModule,
    SlideAcessoComponent,
    SlideLogoComponent,
    SlideExtremaComponent,
    SlideRotaComponent,
  ],
  templateUrl: './banner-samba.component.html',
  styleUrls: ['./banner-samba.component.scss'],
})
export class BannerSambaComponent implements OnInit, OnDestroy {

  // ── URLs dos anúncios — substitua pelos links reais ─────────
  linkSlide1 = 'https://www.booking.com/hotel/br/samba-belo-horizonte-vintage.pt-pt.html?label=popup-clicktrip-bn-n39-020626-i16257793-s120353-w103d1a09-52b6-4f76-9068-2eac3769b042-cu_tab-d703-dc3-eid2b1c228b662241b0861a368702be4837-gdid639068-close_x&aid=2443114&ucfs=1&arphpl=1&checkin=2026-06-02&checkout=2026-06-03&dest_id=-629138&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&hpos=1&hapos=1&sr_order=popularity&nflt=at_bun%3D2%3Bht_id%3D204%3Bclass%3D3&srpvid=35c921baa40001d9&srepoch=1780375689&all_sr_blocks=918105401_363372373_2_1_0&highlighted_blocks=918105401_363372373_2_1_0&matching_block_id=918105401_363372373_2_1_0&sr_pri_blocks=918105401_363372373_2_1_0__30146&from=searchresults&activeTab=photosGallery#hotelTmpl';
  linkSlide2 = 'https://sambahoteis.com/destinos/hotel-samba-belo-horizonte-centro/';
  linkSlide3 = 'https://www.tripadvisor.com.br/Tourism-g2348883-Extrema_State_of_Minas_Gerais-Vacations.html';
  linkSlide4 = 'https://circuitodasaguasmg.com.br';

  // ── Controle do slider ───────────────────────────────────────
  slideAtual = 0;

  readonly TOTAL_SLIDES = 4;
  readonly DURACAO_MS = 5000;

  get totalSlidesArray(): number[] {
    return Array.from({ length: this.TOTAL_SLIDES }, (_, i) => i);
  }

  private intervalo: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.iniciarAutoPlay();
  }

  ngOnDestroy(): void {
    this.pararAutoPlay();
  }

  goTo(index: number): void {
    this.slideAtual = (index + this.TOTAL_SLIDES) % this.TOTAL_SLIDES;
    this.reiniciarAutoPlay();
  }

  mover(direcao: number): void {
    this.goTo(this.slideAtual + direcao);
  }

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
