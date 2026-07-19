import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarrosselSlide {
  src: string;
  titulo?: string;
}

/**
 * Carrossel de imagens estáticas com navegação MANUAL (setas + dots)
 * e título (legenda) opcional por slide.
 * Uso: <app-image-carousel [slides]="[{src:'assets/a.jpg', titulo:'Praia'}]" altura="420px" />
 */
@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css',
})
export class ImageCarouselComponent {
  @Input() slides: CarrosselSlide[] = [];
  @Input() altura = '420px';

  atual = 0;

  get total(): number {
    return this.slides.length;
  }

  irPara(i: number): void {
    if (this.total === 0) return;
    this.atual = (i + this.total) % this.total;
  }

  mover(direcao: number): void {
    this.irPara(this.atual + direcao);
  }
}
