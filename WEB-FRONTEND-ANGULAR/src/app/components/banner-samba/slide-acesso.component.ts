// slide-acesso.component.ts — STANDALONE
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-acesso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-acesso.component.html',
  styleUrls: ['./slide-acesso.component.scss'],
})
export class SlideAcessoComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 1';
}
