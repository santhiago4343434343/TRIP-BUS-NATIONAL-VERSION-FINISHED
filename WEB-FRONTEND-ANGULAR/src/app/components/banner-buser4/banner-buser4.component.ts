import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-banner-buser4',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './banner-buser4.component.html',
    styleUrls: ['./banner-buser4.component.scss']
})
export class BannerBuser4Component implements OnInit, OnDestroy {

    slides = [0, 1, 2];
    currentSlide = 0;
    private autoPlayInterval: any;
    readonly SLIDE_DURATION = 5000; // 5 segundos por slide

    ngOnInit(): void {
        this.startAutoPlay();
    }

    ngOnDestroy(): void {
        this.stopAutoPlay();
    }

    startAutoPlay(): void {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.SLIDE_DURATION);
    }

    stopAutoPlay(): void {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    nextSlide(): void {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }

    prevSlide(): void {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }

    goToSlide(index: number): void {
        this.currentSlide = index;
        // Reinicia o timer ao clicar manualmente
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}
