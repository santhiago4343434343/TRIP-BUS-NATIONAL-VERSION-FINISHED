/*Botão entrar no HOME*/
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-tropical',
  imports: [RouterLink, RouterModule],
  standalone: true,
  templateUrl: './button-tropical.component.html',
  styleUrl: './button-tropical.component.css',
})
export class ButtonTropicalComponent { 
}