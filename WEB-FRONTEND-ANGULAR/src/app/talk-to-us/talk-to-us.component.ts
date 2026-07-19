import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './talk-to-us.component.html',
  styleUrls: ['./talk-to-us.component.scss']
})
export class TalkToUsComponent implements OnInit {

  formContato: FormGroup;

  // Controla se o usuário já tentou enviar (exibe alerta geral)
  formEnviado = false;

  constructor(private fb: FormBuilder) {
    this.formContato = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      assunto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      mensagem: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void { }

  enviarFormulario(): void {
    // Marca todos os campos como tocados para exibir os erros
    this.formContato.markAllAsTouched();
    this.formEnviado = true;

    if (this.formContato.invalid) {
      // Formulário inválido: erros já aparecerão via *ngIf
      return;
    }

    // Formulário válido: processa o envio
    alert('Mensagem enviada com sucesso!');
    this.formContato.reset();
    this.formEnviado = false;
  }
}
