import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TripResumo {
  id: number;
  bus_company: string;
  bus_company_logo?: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time?: string;
  price: number;
}

export interface Reserva {
  id: number;
  codigo: string;
  passageiro: string;
  documento?: string;
  nascimento?: string;
  telefone?: string;
  valor: number;
  status: 'confirmada' | 'cancelada' | 'pendente';
  poltronas: number[];
  url_pagamento?: string;
  motivo_cancelamento?: string;
  cancelada_em?: string;
  created_at: string;
  trip: TripResumo;
  // Retornados na criação, conforme o meio de pagamento:
  erro_pagamento?: string;
  pix_payment_id?: string | number;
  pix_copia_e_cola?: string;
  pix_qr_base64?: string;
}

export interface NovaReserva {
  trip_id: number;
  passageiro: string;
  documento?: string;
  nascimento?: string;
  telefone?: string;
  email?: string;
  poltronas: number[];
  payment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  // O token JWT é anexado automaticamente pelo authInterceptor.
  private readonly API = `${environment.apiUrl}/api/v1/reservas`;

  constructor(private http: HttpClient) {}

  /** Histórico de passagens do usuário logado. */
  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.API);
  }

  /** Cria uma reserva (compra de passagem). */
  criar(payload: NovaReserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.API, { reserva: payload });
  }

  /** Cancela uma passagem e libera as poltronas. */
  cancelar(id: number, motivo?: string): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.API}/${id}/cancelar`, { motivo });
  }

  /** Confirma o pagamento ao voltar do checkout do Mercado Pago. */
  confirmarPagamento(id: number | string, paymentId: string): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.API}/${id}/confirmar_pagamento`, { payment_id: paymentId });
  }

  /** Reabre o link de pagamento de uma passagem pendente (gera um novo se o salvo expirou). */
  continuarPagamento(id: number | string): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.API}/${id}/continuar_pagamento`, {});
  }

  /** Exclui a passagem do histórico (remove do banco e libera as poltronas). */
  excluir(id: number | string): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.API}/${id}`);
  }
}
