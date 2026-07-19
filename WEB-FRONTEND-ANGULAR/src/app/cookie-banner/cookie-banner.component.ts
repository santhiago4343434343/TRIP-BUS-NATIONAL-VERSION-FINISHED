import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from '@services/cookie.service';
import { CookiePanelComponent } from '@app/cookie-panel/cookie-panel.component';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, CookiePanelComponent], 
  /*component pai cookie-banner.component ::: filho:::Cookie-Panel.Component 
  importar component filho em component pai*/
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {
  mostrarAvisoCookies = false;
  mostrarPainel = false;

  abrirPainelCookies() {
    this.mostrarPainel = true;
  }

  constructor(private cookieService: CookieService) {}

 ngOnInit(): void {
  const consentimento = this.cookieService.get('cookiesConsent');
  const preferencias = this.cookieService.get('preferenciasCookies');

  // Enquanto o usuário não salvar as preferências (ou aceitar/recusar),
  // abre automaticamente o popup com as flags (funcionais / analíticos / marketing).
  const jaDecidiu = !!consentimento || !!preferencias;
  this.mostrarPainel = !jaDecidiu;
  this.mostrarAvisoCookies = false;

  if (preferencias) {
    try {
      const parsed = JSON.parse(preferencias);
      console.log('Preferências de cookies:', parsed);
    } catch {
      // ignora preferências inválidas
    }
  }
}

  aceitarCookies(): void {
    this.cookieService.set('cookiesConsent', 'true', 365);
    this.mostrarAvisoCookies = false;
  }

  recusarCookies(): void {
    this.cookieService.set('cookiesConsent', 'false', 365);
    this.mostrarAvisoCookies = false;
  }
}
