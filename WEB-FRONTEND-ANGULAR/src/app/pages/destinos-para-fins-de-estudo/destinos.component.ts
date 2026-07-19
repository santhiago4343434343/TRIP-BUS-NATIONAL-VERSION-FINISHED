/*PARA FINS DE ESTUDO, COMPONENT INATIVADO */

import { Component } from '@angular/core';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.scss']
})
export class DestinosComponent {
  selectedCity: string | null = null;

  selectCity(city: string) {
    this.selectedCity = city;
  }
}
