import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HotelResumo {
  id: number;
  name: string;
  city: string;
  stars: number;
  image_url?: string;
}

export interface HotelReserva {
  id: number;
  codigo: string;
  hospede: string;
  tipo_quarto: string;
  check_in: string;
  check_out: string;
  num_hospedes: number;
  noites: number;
  valor: number;
  status: 'confirmada' | 'cancelada' | 'pendente';
  motivo_cancelamento?: string;
  cancelada_em?: string;
  created_at: string;
  hotel: HotelResumo;
}

export interface NovaHotelReserva {
  hotel_id: number;
  hospede: string;
  tipo_quarto: string;
  check_in: string;
  check_out: string;
  num_hospedes: number;
}

@Injectable({ providedIn: 'root' })
export class HotelReservaService {
  // O token JWT é anexado automaticamente pelo authInterceptor.
  private readonly API = `${environment.apiUrl}/api/v1/hotel_reservas`;

  constructor(private http: HttpClient) {}

  /** Reservas de hotel do usuário logado. */
  listar(): Observable<HotelReserva[]> {
    return this.http.get<HotelReserva[]>(this.API);
  }

  /** Cria uma reserva de hotel. */
  criar(payload: NovaHotelReserva): Observable<HotelReserva> {
    return this.http.post<HotelReserva>(this.API, { hotel_reserva: payload });
  }

  /** Cancela uma reserva de hotel. */
  cancelar(id: number, motivo?: string): Observable<HotelReserva> {
    return this.http.post<HotelReserva>(`${this.API}/${id}/cancelar`, { motivo });
  }

  /** Exclui a reserva de hotel do histórico (remove do banco). */
  excluir(id: number | string): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.API}/${id}`);
  }
}
