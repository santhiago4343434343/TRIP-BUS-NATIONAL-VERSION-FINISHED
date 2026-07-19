import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas que consomem a API em tempo real -> renderizadas no cliente
  // (evita chamadas à API Rails durante o prerender/build).
  { path: 'tickets', renderMode: RenderMode.Client },
  { path: 'passagens', renderMode: RenderMode.Client },
  { path: 'historico', renderMode: RenderMode.Client },
  { path: 'minhas-passagens', renderMode: RenderMode.Client },
  { path: 'cancelamentos', renderMode: RenderMode.Client },
  { path: 'hotel', renderMode: RenderMode.Client },
  { path: 'hoteis', renderMode: RenderMode.Client },

  // Demais rotas continuam pré-renderizadas.
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
