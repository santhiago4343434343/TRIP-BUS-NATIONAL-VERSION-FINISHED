import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component'; // Ajustado o caminho se necessário
import { MatToolbar } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component'
import { CookiePanelComponent } from './cookie-panel/cookie-panel.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    CookiePanelComponent,
    CookieBannerComponent,
    HeaderComponent,
    FooterComponent,
    MatToolbar
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // CORREÇÃO: Mantivemos apenas uma declaração de título. 
  // Usar signal é mais performático para o Angular moderno.
  title = signal('TRIP-BUS-NATIONAL');

  mostrarPainel = false;

  abrirPainelCookies() {
    this.mostrarPainel = true;
  }

  fecharPainelCookies() {
    this.mostrarPainel = false;
  }

  direcionarParaWhatsapp() {
    const telefone = "5513991889820";
    const mensagem = "Olá! Estou navegando no site da Trip Bus e gostaria de tirar uma dúvida.";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }
}