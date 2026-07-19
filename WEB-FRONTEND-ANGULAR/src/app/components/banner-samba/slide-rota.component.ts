// slide-rota.component.ts — STANDALONE
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-rota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-rota.component.html',
  styleUrls: ['./slide-rota.component.scss'],
})
export class SlideRotaComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 2';
}
