// slide-logo.component.ts — STANDALONE
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-logo.component.html',
  styleUrls: ['./slide-logo.component.scss'],
})
export class SlideLogoComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 1';
}
