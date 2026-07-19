import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ImagemCredito {
  nome: string;
  arquivo: string; // caminho em assets
  fonte: string;   // URL da página de origem da imagem
}

@Component({
  selector: 'app-uso-de-imagens',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './uso-de-imagens.component.html',
  styleUrl: './uso-de-imagens.component.css',
})
export class UsoDeImagensComponent {
  // "fonte" = site oficial / página de origem de cada imagem.
  logosOnibus: ImagemCredito[] = [
    { nome: 'Viação Cometa',       arquivo: 'assets/Logotipo_Cometa004.png',  fonte: 'https://www.viacaocometa.com.br/' },
    { nome: 'Gontijo',             arquivo: 'assets/banner-gontijo.jpg',       fonte: 'https://www.gontijo.com.br/' },
    { nome: 'Catarinense',         arquivo: 'assets/catarinense.png',          fonte: 'https://www.catarinense.com.br/' },
    { nome: 'Eucatur',             arquivo: 'assets/eucatur-logo.jpg',         fonte: 'https://www.eucatur.com.br/' },
    { nome: 'Guerino Seiscentos',  arquivo: 'assets/guerinoseissento004.jpg',  fonte: 'https://guerinoseiscento.com.br/' },
    { nome: 'Princesa dos Campos', arquivo: 'assets/princesa-dos-campos.png',  fonte: 'https://www.princesadoscampos.com.br/' },
    { nome: 'Vallesul',            arquivo: 'assets/vallesul.png',             fonte: 'https://www.vallesulservicos.com.br/' },
    { nome: 'Passaro Marrom',      arquivo: 'assets/passaro-marrom001.jpg',    fonte: 'https://www.passaromarron.com.br/' },
  ];

  hoteis: ImagemCredito[] = [
    { nome: 'Samba Hotéis',        arquivo: 'assets/SAMBAHOTEIS.JPG',                   fonte: 'https://sambahoteis.com/' },
    { nome: 'Samba Hotéis (logo)', arquivo: 'assets/SAMBAHOTEIS001-BELOHORIZONTE.png',  fonte: 'https://sambahoteis.com/' },
    { nome: 'Angra Inn',           arquivo: 'assets/angrainn-hotel.jpg',                fonte: 'https://www.booking.com/hotel/br/angra-inn-angra-dos-reis.html' },
    { nome: 'Angra dos Reis',      arquivo: 'assets/angra-dos-reis.jpg',                fonte: 'https://pt.wikipedia.org/wiki/Angra_dos_Reis' },
    { nome: 'InterContinental',    arquivo: 'assets/intercontinental.avif',             fonte: 'https://www.ihg.com/intercontinental/' },
    { nome: 'Hotel Tangará',       arquivo: 'assets/tangara.jpg',                       fonte: 'https://www.oetkerhotels.com/hotels/palacio-tangara/' },
    { nome: 'Marsol Beach Resort', arquivo: 'assets/marsol-beach-resort.jpg',           fonte: 'https://www.hotelmarsol.com.br/' },
  ];

  destinos: ImagemCredito[] = [
    { nome: 'Paraty',                  arquivo: 'assets/Paraty-720x250.jpg',        fonte: 'https://pt.wikipedia.org/wiki/Paraty' },
    { nome: 'Praia',                   arquivo: 'assets/praia005.jpg',              fonte: 'https://pt.wikipedia.org/wiki/Praia' },
    { nome: 'Belo Horizonte',          arquivo: 'assets/BELO-HORIZONTE.jpg',        fonte: 'https://pt.wikipedia.org/wiki/Belo_Horizonte' },
    { nome: 'Recife',                  arquivo: 'assets/recife.jpg',                fonte: 'https://pt.wikipedia.org/wiki/Recife' },
    { nome: 'Paraty / Rio de Janeiro', arquivo: 'assets/paraty-riodejaneiro.webp',  fonte: 'https://pt.wikipedia.org/wiki/Paraty' },
  ];
}
