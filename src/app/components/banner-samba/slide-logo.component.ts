// slide-logo.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-logo',
  templateUrl: './slide-logo.component.html',
  styleUrls: ['./slide-logo.component.scss']
})
export class SlideLogoComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 1';
}
