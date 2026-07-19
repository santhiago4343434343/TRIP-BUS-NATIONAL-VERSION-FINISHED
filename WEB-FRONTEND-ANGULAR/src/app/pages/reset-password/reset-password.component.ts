// DESTINO: src/app/pages/reset-password/reset-password.component.ts
 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
 
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  mostrarSenha = false;   // olhinho: alterna os campos de senha entre 'password' e 'text'
 
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    // Reads token from URL: /reset-password?token=xxxxx
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage = 'Invalid reset link.';
    }
  }
 
  submit(): void {
    if (this.isLoading) return;
 
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
 
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
 
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (e) => {
        this.errorMessage = e.error?.error ?? 'Invalid or expired link.';
        this.isLoading = false;
      },
    });
  }
}