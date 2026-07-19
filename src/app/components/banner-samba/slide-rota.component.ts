// slide-rota.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-rota',
  templateUrl: './slide-rota.component.html',
  styleUrls: ['./slide-rota.component.scss']
})
export class SlideRotaComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 2';
}
