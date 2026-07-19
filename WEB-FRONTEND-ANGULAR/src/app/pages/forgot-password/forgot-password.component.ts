// DESTINO: src/app/pages/forgot-password/forgot-password.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) { }

  submit(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.isLoading = false;
      },
    });
  }
}