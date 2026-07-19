import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  // Porta 3000 para o Rails no Docker/WSL
  private readonly apiUrl: string = '/api/v1/checkouts';

  constructor(private http: HttpClient) {}

  /**
   * POST - Criar Pedido (Finalizar)
   * Envia os dados no formato que o Rails espera (dentro de 'checkout')
   */
  finalizarPedido(orderData: any): Observable<any> {
    // Transforma a lista de objetos do carrinho em uma string legível
    const nomesProdutos = orderData.cart?.map((p: any) => `${p.quantidade}x ${p.nome}`).join(', ') || 'Carrinho vazio';

    const payload = {
      checkout: {
        total: orderData.total || 0,
        user_id: 1, // ID do usuário padrão no seu banco
        status: 'pendente',
        cart: nomesProdutos,
        emailCliente: orderData.email || 'cliente@teste.com',
        // Proteção: Se o endereço estiver vazio, envia um texto padrão para evitar Erro 422
        address: (orderData.address?.rua && orderData.address?.numero)
          ? `${orderData.address.rua}, ${orderData.address.numero}`
          : 'Endereço não informado (Teste)',
        delivery: orderData.delivery?.nome || 'Padrão',
        payment: orderData.payment?.metodo || 'A definir'
      }
    };

    return this.http.post<any>(this.apiUrl, payload);
  }

  /**
   * GET - Listar todos os pedidos (Histórico)
   */
  listarPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * PATCH/PUT - Atualizar Pedido (Lápis ✏️)
   */
  atualizarPedido(id: number, novosDados: any): Observable<any> {
    // Envelopa os dados em 'checkout' para o Rails aceitar
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { checkout: novosDados });
  }

  /**
   * DELETE - Excluir Pedido (Lixeira 🗑️)
   */
  excluirPedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
