import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-rio-de-janeiro',
  standalone: true,
  templateUrl: './rio-de-janeiro.component.html',
  styleUrls: ['./rio-de-janeiro.component.scss']
})
export class RioDeJaneiroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  totalSlides = 4;
  intervalId: any;

  ngOnInit() {
    // troca automática a cada 5 segundos
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }
}


/* inserção de carrossel em banner para dinamismo  */