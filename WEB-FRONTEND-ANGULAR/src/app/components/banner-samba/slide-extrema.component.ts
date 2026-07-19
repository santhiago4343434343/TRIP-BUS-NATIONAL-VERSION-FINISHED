// slide-extrema.component.ts — STANDALONE
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-extrema',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-extrema.component.html',
  styleUrls: ['./slide-extrema.component.scss'],
})
export class SlideExtremaComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 2';
}
