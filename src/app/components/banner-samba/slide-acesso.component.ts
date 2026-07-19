// ============================================================
// SLIDE 1 — slide-acesso.component.ts
// ============================================================
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-acesso',
  templateUrl: './slide-acesso.component.html',
  styleUrls: ['./slide-acesso.component.scss']
})
export class SlideAcessoComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 1';
}
