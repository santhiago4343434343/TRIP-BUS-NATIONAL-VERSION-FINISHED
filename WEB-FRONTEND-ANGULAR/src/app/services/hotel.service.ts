import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RoomType {
  nome: string;
  preco_diaria: number;
  capacidade: number;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address?: string;
  stars: number;
  price_per_night: number;
  image_url?: string;
  description?: string;
  amenities: string[];
  room_types: RoomType[];
  total_rooms?: number;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly API = `${environment.apiUrl}/api/v1/hotels`;

  constructor(private http: HttpClient) {}

  /** Lista todos os hotéis (grade). */
  listar(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.API);
  }

  /** Detalhe do hotel + tipos de quarto. */
  buscar(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.API}/${id}`);
  }
}
