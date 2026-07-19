// slide-extrema.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-extrema',
  templateUrl: './slide-extrema.component.html',
  styleUrls: ['./slide-extrema.component.scss']
})
export class SlideExtremaComponent {
  @Input() isActive = false;
  @Input() link     = '#';
  @Input() adLabel  = 'anúncio 2';
}
