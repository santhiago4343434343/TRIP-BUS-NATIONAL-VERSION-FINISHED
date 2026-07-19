import { Routes, provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { environment } from '../environments/environment';

// Imports fixos (Eager Loading) - Páginas principais
import { SobreNosComponent } from './pages/sobre-nos/sobre-nos.component';
import { CentralAjudaComponent } from './pages/central-ajuda/central-ajuda.component';
import { TrabalheConoscoComponent } from './pages/trabalhe-conosco/trabalhe-conosco.component';
import { PrivacidadeComponent } from './pages/privacidade/privacidade.component';
import { CancelamentosComponent } from './pages/cancelamentos/cancelamentos.component';
import { TermosUsoComponent } from './pages/termos-uso/termos-uso.component';
import { LoginComponent } from './pages/login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // --- HOME ---
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },

  // --- INSTITUCIONAL ---
  { path: 'sobre', component: SobreNosComponent },
  { path: 'trabalhe-conosco', component: TrabalheConoscoComponent },
  { path: 'privacidade', component: PrivacidadeComponent },
  { path: 'central-ajuda', component: CentralAjudaComponent },
  { path: 'atendimento', component: CentralAjudaComponent },
  { path: 'cancelamentos', component: CancelamentosComponent },
  { path: 'termos-uso', component: TermosUsoComponent },
  {
    path: 'uso-de-imagens',
    loadComponent: () => import('./pages/uso-de-imagens/uso-de-imagens.component').then(m => m.UsoDeImagensComponent)
  },


  // --- DESTINOS ---
  {
    path: 'destinos/sao-paulo',
    loadComponent: () => import('./destinos/sao-paulo/sao-paulo.component').then(m => m.SaoPauloComponent)
  },
  // --- AUTENTICAÇÃO ---
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'minha-conta',
    loadComponent: () => import('./pages/minha-conta/minha-conta.component').then(m => m.MinhaContaComponent)
  },

  {
    path: 'destinos/rio-de-janeiro',
    loadComponent: () => import('./destinos/rio-de-janeiro/rio-de-janeiro.component').then(m => m.RioDeJaneiroComponent)
  },
  {
    path: 'destinos/belo-horizonte',
    loadComponent: () => import('./destinos/belo-horizonte/belo-horizonte.component').then(m => m.BeloHorizonteComponent)
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },

  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // --- OUTROS ---
  {
    path: 'talk-to-us',
    loadComponent: () => import('./talk-to-us/talk-to-us.component').then(m => m.TalkToUsComponent)
  },

  // --- PASSAGENS ---
  {
    path: 'tickets',
    loadComponent: () => import('./tickets/tickets.component').then(m => m.TicketsComponent)
  },
  { path: 'passagens', redirectTo: 'tickets', pathMatch: 'full' },
  {
    path: 'historico',
    loadComponent: () => import('./pages/historico/historico.component').then(m => m.HistoricoComponent)
  },
  { path: 'minhas-passagens', redirectTo: 'historico', pathMatch: 'full' },
  {
    path: 'pagamento-retorno',
    loadComponent: () => import('./pages/pagamento-retorno/pagamento-retorno.component').then(m => m.PagamentoRetornoComponent)
  },

  // --- HOTÉIS ---
  {
    path: 'hotel',
    loadComponent: () => import('./hotel/hotel.component').then(m => m.HotelComponent)
  },
  { path: 'hoteis', redirectTo: 'hotel', pathMatch: 'full' },

  // --- ERROS ---
  {
    path: '**',
    loadComponent: () => import('./pages/nao-encontrado/nao-encontrado.component').then(m => m.NaoEncontradoComponent)
  }
];

// Configuração do Provedor de Rotas
export const routerProviders = [
  provideRouter(
    routes,
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    ...(environment.useHash ? [withHashLocation()] : [])
  )
];
