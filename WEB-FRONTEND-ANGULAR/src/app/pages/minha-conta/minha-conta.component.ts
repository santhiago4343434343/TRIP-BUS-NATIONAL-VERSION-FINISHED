// ============================================================
// DESTINO: src/app/pages/minha-conta/minha-conta.component.ts
// AÇÃO: SUBSTITUIR o arquivo inteiro
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
 
@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss'],
})
export class MinhaContaComponent implements OnInit {
  name = '';
  email = '';
  isSaving = false;
  successMessage = '';
  errorMessage = '';
 
  constructor(public authService: AuthService) {}
 
  ngOnInit(): void {
    // 1. Show localStorage data immediately (no network wait)
    const u = this.authService.user;
    if (u) {
      this.name = u.name;
      this.email = u.email;
    }
 
    // 2. Fetch the official version from MariaDB (source of truth)
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.name = profile.name;
        this.email = profile.email;
      },
      error: () => {
        // If it fails (e.g. expired token), keep local data
      },
    });
  }
 
  save(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';
 
    this.authService.updateProfile(this.name.trim(), this.email.trim()).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Profile updated successfully!';
        this.isSaving = false;
      },
      error: (e: any) => {
        this.errorMessage = e.error?.errors?.[0]
          ?? (e.status === 401 ? 'Session expired. Please log in again.' : 'Failed to save. Please try again.');
        this.isSaving = false;
      },
    });
  }
}
 