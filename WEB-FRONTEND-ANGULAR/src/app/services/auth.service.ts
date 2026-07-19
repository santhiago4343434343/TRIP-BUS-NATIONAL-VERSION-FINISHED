// ============================================================
// DESTINO: src/app/services/auth.service.ts
// AÇÃO: SUBSTITUIR o arquivo inteiro
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

export interface LoggedUser {
  id: number;
  name: string;
  email: string;
}

// Raw format returned by Rails
interface ApiUser {
  id: number;
  email: string;
  name?: string;
  nome?: string;
}

interface AuthResponse {
  message?: string;
  token: string;
  user: ApiUser;
}

interface ProfileResponse {
  user: ApiUser;
}

export interface UpdateResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = '/api/v1';

  constructor(private http: HttpClient) { }

  // Normalizes Rails response (name/nome) to frontend model
  private normalize(u: ApiUser): LoggedUser {
    return { id: u.id, name: u.name ?? u.nome ?? '', email: u.email };
  }

  private saveUser(user: LoggedUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // ---------- REGISTER ----------
  register(name: string, email: string, cpf: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, {
        name,
        email,
        cpf,
        password,
        password_confirmation: password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          this.saveUser(this.normalize(res.user));
        })
      );
  }

  // ---------- LOGIN ----------
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          this.saveUser(this.normalize(res.user));
        })
      );
  }

  // ---------- PROFILE: fetch from database ----------
  getProfile(): Observable<LoggedUser> {
    return this.http
      .get<ProfileResponse>(`${this.API_URL}/users/profile`)
      .pipe(
        map((res) => this.normalize(res.user)),
        tap((u) => this.saveUser(u))
      );
  }

  // ---------- PROFILE: save changes ----------
  updateProfile(name: string, email: string): Observable<UpdateResponse> {
    return this.http
      .patch<UpdateResponse>(`${this.API_URL}/users/update_profile`, { name, email })
      .pipe(
        tap(() => {
          const current = this.user;
          if (current) {
            this.saveUser({ ...current, name, email });
          }
        })
      );
  }

  // ---------- SESSION ----------
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user(): LoggedUser | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
  // DESTINO: src/app/services/auth.service.ts
  // AÇÃO: ADICIONAR estes dois métodos dentro da classe AuthService
  // (cole antes do fechamento da classe, após o método resetPassword)

  // ---------- FORGOT PASSWORD ----------
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/auth/forgot_password`,
      { email }
    );
  }

  // ---------- RESET PASSWORD ----------
  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/auth/reset_password`,
      { token, password, password_confirmation: password }
    );
  }
}
