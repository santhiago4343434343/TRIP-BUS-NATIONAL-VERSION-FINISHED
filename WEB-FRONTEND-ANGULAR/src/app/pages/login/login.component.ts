// DESTINO: src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;
  mostrarSenha = false;   // olhinho: alterna o input entre 'password' e 'text'

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  entrar(): void {
    if (this.carregando) return;
    this.erro = '';
    this.carregando = true;

    this.authService.login(this.email, this.senha).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (e) => {
        this.erro =
          e.status === 401
            ? 'E-mail ou senha inválidos.'
            : 'Erro ao conectar com o servidor. O Rails está rodando?';
        this.carregando = false;
      },
    });
  }
}
