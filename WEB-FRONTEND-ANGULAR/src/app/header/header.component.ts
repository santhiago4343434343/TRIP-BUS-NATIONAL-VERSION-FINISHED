// ============================================================
// DESTINO: src/app/header/header.component.ts
// AÇÃO: SUBSTITUIR o arquivo inteiro por este
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '@services/carrinho.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from '@services/produtos.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  termoBusca: string = '';

  // Controla se o dropdown "Minha Conta" está aberto ou fechado
  menuAberto = false;

  constructor(
    public carrinhoService: CarrinhoService,
    private router: Router,
    private produtosService: ProdutosService,
    public authService: AuthService // public para o HTML poder usar
  ) {}

  ngOnInit(): void { }

  // Abre/fecha o dropdown
  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  // Fecha o dropdown (usado ao clicar em um item)
  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    this.fecharMenu();
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  buscar(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const termo = this.termoBusca.trim().toLowerCase();
    if (termo) {
      const servidores = this.produtosService.getServidores();
      const ehServidor = termo.includes('servidor') ||
                         servidores.some(s => s.nome.toLowerCase().includes(termo));
      const rota = ehServidor ? '/servidores' : '/produtos';
      this.router.navigate([rota], { queryParams: { busca: this.termoBusca } });
    }
  }
}
