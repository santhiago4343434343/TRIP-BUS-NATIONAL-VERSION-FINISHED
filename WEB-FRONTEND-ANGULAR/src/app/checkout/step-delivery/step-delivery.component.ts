import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-delivery.component.html',
  styleUrls: ['./step-delivery.component.scss']
})
export class StepDeliveryComponent {
  @Output() deliveryData = new EventEmitter<any>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>(); // 🔑 retorno a opção anterior no progressBar 
  // 🔑 Mock de valores e prazos
  options = [
    { nome: 'PAC', valor: 50.00, prazo: '5 dias úteis' },
    { nome: 'SEDEX', valor: 120.00, prazo: '2 dias úteis' },
    { nome: 'Jadlog', valor: 80.00, prazo: '4 dias úteis' },
    { nome: 'Loggi', valor: 60.00, prazo: '3 dias úteis' },
    { nome: 'Total Express', valor: 70.00, prazo: '6 dias úteis' }
  ];

  selecionado: any = null;

  selecionar(opcao: any) {
    this.selecionado = opcao;
  }

  continuar() {
    if (this.selecionado) {
      this.deliveryData.emit(this.selecionado);
      this.next.emit();
    } else {
      alert('Por favor, selecione ao menos uma opção para prosseguir!')
    }
  }

 voltar() {
   this.back.emit();

  }
}

