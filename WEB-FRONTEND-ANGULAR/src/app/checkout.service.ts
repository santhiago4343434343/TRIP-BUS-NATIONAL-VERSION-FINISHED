/*
FUNÇÃO UTILIZADA EM pedido.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  // A URL deve apontar para o seu backend Rails no Docker
  private apiUrl = 'http://localhost:3000/api/v1/checkouts';

  constructor(private http: HttpClient) { }

  // GET: Para listar os pedidos na tela de revisão
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // POST: Para criar o pedido e gerar o link do Mercado Pago
  criarPedido(dados: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { checkout: dados });
  }

  // DELETE: Para a LIXEIRA funcionar
  excluirPedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // PUT: Para o LÁPIS (atualizar status) funcionar
  atualizarStatus(id: number, novoStatus: string): Observable<any> {
    // Note que passamos o ID na URL e o novo status no corpo (body)
    return this.http.put(`${this.apiUrl}/${id}`, { status: novoStatus });
  }
}*/