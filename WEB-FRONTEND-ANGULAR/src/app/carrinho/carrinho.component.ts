import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../services/carrinho.service';
import { IprodutoCarrinho } from '@interfaces/iproduto-carrinho';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
})
export class CarrinhoComponent implements OnInit {
  itemsCarrinho: IprodutoCarrinho[] = [];

  // 🔑 Campos para frete
  cep: string = '';

  fretePAC: number = 0;
  prazoPAC: string = '';

  freteSEDEX: number = 0;
  prazoSEDEX: string = '';

  freteJadlog: number = 0;
  prazoJadlog: string = '';

  freteLoggi: number = 0;
  prazoLoggi: string = '';

  freteTotalExpress: number = 0;
  prazoTotalExpress: string = '';

  freteSelecionado: number = 0;

  constructor(
    public carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemsCarrinho = this.carrinhoService.obterCarrinho();
  }

  removerProdutoCarrinho(produtoId: number): void {
    this.itemsCarrinho = this.itemsCarrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(this.itemsCarrinho));
  }

  get total(): number {
    return this.itemsCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }

  get totalComFrete(): number {
    return this.total + this.freteSelecionado;
  }

  removerItem(index: number): void {
    this.itemsCarrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(this.itemsCarrinho));
  }

  comprar(): void {
    alert("Obrigado pela preferencia! voce sera direcionado para realização de checkout. aguarde, ou clique em ok para prosseguir! ");
    this.router.navigate(["checkout"]);
  }

  // 🔑 Mock simples para testes em localhost
  calcularFrete(): void {
    setTimeout(() => {
      // Correios
      this.fretePAC = 50.00;
      this.prazoPAC = '5';
      this.freteSEDEX = 120.00;
      this.prazoSEDEX = '2';

      // Jadlog
      this.freteJadlog = 80.00;
      this.prazoJadlog = '4';

      // Loggi
      this.freteLoggi = 60.00;
      this.prazoLoggi = '3';

      // Total Express
      this.freteTotalExpress = 70.00;
      this.prazoTotalExpress = '6';
    }, 500); // simula tempo de resposta
  }

  selecionarFrete(valor: number): void {
    this.freteSelecionado = valor;
  }
}
