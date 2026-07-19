import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Trip {
  id: number;
  bus_company: string;
  bus_company_logo?: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time?: string;
  price: number;
  total_seats: number;
  seats_available: number;
  assentos_ocupados?: number[];
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly API = `${environment.apiUrl}/api/v1/trips`;

  constructor(private http: HttpClient) {}

  /** Lista todas as viagens (grade de passagens). */
  listar(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.API);
  }

  /** Detalhe da viagem + poltronas ocupadas (mapa de assentos). */
  buscar(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.API}/${id}`);
  }
}
