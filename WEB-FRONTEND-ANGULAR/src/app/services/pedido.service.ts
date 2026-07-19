import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  // Verifique se a porta do seu Rails é 3000 ou se você usa o proxy do Angular (4200)
  private readonly apiUrl: string = 'http://127.0.0.1:3000/api/v1/checkouts';

  constructor(private http: HttpClient) {}

  // POST - Criar
  finalizarPedido(orderData: any): Observable<any> {
    const nomesProdutos = orderData.cart.map((p: any) => `${p.quantidade}x ${p.nome}`).join(', ');
    
    const payload = {
      checkout: {
        total: Number(orderData.total) || 0,
        user_id: 1, // Certifique-se que existe um usuário com ID 1 no seu banco de dados
        status: 'pendente',
        cart: nomesProdutos,
        emailCliente: orderData.email || 'cliente@teste.com',
        address: `${orderData.address?.rua}, ${orderData.address?.numero}`,
        delivery: orderData.delivery?.nome,
        payment: orderData.payment?.metodo
      }
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  // GET - Listar
  listarPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // PUT - Atualizar
  atualizarPedido(id: number, novosDados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { checkout: novosDados });
  }

  // DELETE - Excluir
  excluirPedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
