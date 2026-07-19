import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-banner-belo-horizonte',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './banner-belo-horizonte.component.html',
    styleUrls: ['./banner-belo-horizonte.component.scss'],
})
export class BannerBeloHorizonteComponent implements OnInit, OnDestroy {

    // ─── Estado do slider ───────────────────────────────────
    readonly slides = [0, 1, 2];
    currentSlide = 0;
    isProgressRunning = false;
    readonly autoPlayInterval = 5500; // ms entre transições

    private timer: ReturnType<typeof setInterval> | null = null;

    constructor(private cdr: ChangeDetectorRef) { }

    // ─── Lifecycle ──────────────────────────────────────────
    ngOnInit(): void { this.startAutoPlay(); }
    ngOnDestroy(): void { this.stopAutoPlay(); }

    // ─── Auto-play ──────────────────────────────────────────
    startAutoPlay(): void {
        this.stopAutoPlay();
        this.restartProgressBar();
        this.timer = setInterval(() => this.advanceSlide(), this.autoPlayInterval);
    }

    stopAutoPlay(): void {
        if (this.timer !== null) { clearInterval(this.timer); this.timer = null; }
        this.isProgressRunning = false;
    }

    // ─── Navegação pública ──────────────────────────────────
    goTo(index: number): void {
        if (index === this.currentSlide) { return; }
        this.currentSlide = index;
        this.startAutoPlay();
    }

    next(): void { this.advanceSlide(); this.startAutoPlay(); }

    prev(): void {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.startAutoPlay();
    }

    // ─── Privados ───────────────────────────────────────────
    private advanceSlide(): void {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.restartProgressBar();
    }

    private restartProgressBar(): void {
        this.isProgressRunning = false;
        this.cdr.detectChanges(); // força re-render para reiniciar a animação CSS
        this.isProgressRunning = true;
    }
}
