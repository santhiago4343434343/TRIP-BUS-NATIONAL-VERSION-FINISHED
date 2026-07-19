import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';                                          // ← ADICIONADO
import { BannerSambaComponent } from '../../components/banner-samba/banner-samba.component';
import { CommonModule } from '@angular/common';
import { BannerBeloHorizonteComponent } from '../../components/banner-belo-horizonte/banner-belo-horizonte.component';
import { BannerBuser4Component } from '@app/components/banner-buser4/banner-buser4.component';

@Component({
  selector: 'app-belo-horizonte',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,                                                                        // ← ADICIONADO
    BannerSambaComponent,
    BannerBeloHorizonteComponent,
    BannerBuser4Component,
  ],
  templateUrl: './belo-horizonte.component.html',
  styleUrls: ['./belo-horizonte.component.scss']
})
export class BeloHorizonteComponent implements OnInit, OnDestroy {

  // Controla qual slide está ativo (0 = img1, 1 = img2, 2 = img3)
  slideAtual: number = 0;

  private readonly TOTAL_SLIDES = 3;
  private readonly DURACAO_MS = 7000; // 7 segundos por slide
  private intervalo: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.iniciarCarrossel();
  }

  ngOnDestroy(): void {
    // Limpa o intervalo ao destruir o componente — evita memory leak
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  private iniciarCarrossel(): void {
    this.intervalo = setInterval(() => {
      this.slideAtual = (this.slideAtual + 1) % this.TOTAL_SLIDES;
    }, this.DURACAO_MS);
  }

}
