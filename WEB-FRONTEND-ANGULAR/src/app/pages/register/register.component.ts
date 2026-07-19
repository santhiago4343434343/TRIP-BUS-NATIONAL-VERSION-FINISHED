// ============================================================
// DESTINO: src/app/pages/register/register.component.ts
// ============================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  cpf = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  mostrarSenha = false;   // olhinho: alterna os campos de senha entre 'password' e 'text'

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    if (this.isLoading) return;

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(this.name.trim(), this.email.trim(), this.cpf.trim(), this.password).subscribe({
      next: () => {
        this.successMessage = 'Account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (e) => {
        this.errorMessage = e.error?.errors?.[0] ?? 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
