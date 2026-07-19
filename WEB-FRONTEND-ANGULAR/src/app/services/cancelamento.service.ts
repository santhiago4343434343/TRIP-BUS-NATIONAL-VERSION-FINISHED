import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interface que define a estrutura da Reserva vinda do MariaDB.
 * Isso ajuda o TypeScript a te dar auto-complete no componente.
 */
export interface Reserva {
    id: string;
    passageiro: string;
    origem: string;
    destino: string;
    dataViagem: string;
    valor: number;
}

@Injectable({
    providedIn: 'root'
})
export class CancelamentoService {

    // A URL agora é dinâmica baseada no environment (http://localhost:3000)
    private readonly API_URL = `${environment.apiUrl}/cancelamentos`;

    constructor(private http: HttpClient) { }

    /**
     * Busca uma reserva específica no Rails.
     * O Rails fará a query no MariaDB usando o código fornecido.
     */
    buscarReserva(codigo: string): Observable<Reserva> {
        // Exemplo: GET http://localhost:3000/cancelamentos/TRIP-123
        return this.http.get<Reserva>(`${this.API_URL}/${codigo}`);
    }

    /**
     * Envia a solicitação de cancelamento para o backend.
     */
    solicitarCancelamento(id: string, motivo: string): Observable<any> {
        const payload = {
            reserva_id: id,
            motivo: motivo,
            data_solicitacao: new Date().toISOString()
        };

        // Exemplo: POST http://localhost:3000/cancelamentos/confirmar
        return this.http.post(`${this.API_URL}/confirmar`, payload);
    }
}