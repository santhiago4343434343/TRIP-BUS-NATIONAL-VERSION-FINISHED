import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from '@app/services/cookie.service';

@Component({
  selector: 'app-cookie-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cookie-panel.component.html',
  styleUrls: ['./cookie-panel.component.scss']
})
export class CookiePanelComponent {
  @Output() fechar = new EventEmitter<void>();

  cookiesFuncionais = true;
  cookiesAnaliticos = false;
  cookiesMarketing = false;


  constructor(private cookieService: CookieService) {}

  salvarPreferencias() {
    const preferencias = {
      funcionais: this.cookiesFuncionais,
      analiticos: this.cookiesAnaliticos,
      marketing: this.cookiesMarketing
    };

    this.cookieService.set('preferenciasCookies' ,JSON.stringify(preferencias), 365);

    alert('Preferências salvas!');
    this.fechar.emit(); // fecha o painel
  }

  fecharPainel() {
    this.fechar.emit(); // fecha manualmente
  }
}
