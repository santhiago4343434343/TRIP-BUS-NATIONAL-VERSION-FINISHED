# Banner Samba – Componentes Angular

## Estrutura de pastas

```
src/app/
└── banner-samba/
    ├── shared/
    │   └── banner-slide.shared.scss      ← keyframes e %placeholders compartilhados
    │
    ├── banner-samba.module.ts            ← declara e exporta tudo
    ├── banner-samba.component.ts         ← pai: controla slideAtual e autoplay
    ├── banner-samba.component.html
    ├── banner-samba.component.scss
    │
    ├── slide-acesso.component.ts         ← slide 1 – #uai das gerais
    ├── slide-acesso.component.html
    ├── slide-acesso.component.scss
    │
    ├── slide-logo.component.ts           ← slide 2 – logo Samba Hotéis
    ├── slide-logo.component.html
    ├── slide-logo.component.scss
    │
    ├── slide-extrema.component.ts        ← slide 3 – Conheça Extrema
    ├── slide-extrema.component.html
    ├── slide-extrema.component.scss
    │
    ├── slide-rota.component.ts           ← slide 4 – Rota das Águas
    ├── slide-rota.component.html
    └── slide-rota.component.scss
```

## O que você adapta (apenas 3 passos)

### 1. Imagens
Copie as 4 imagens para `src/assets/banner/` com estes nomes:
- `slide-acesso.png`  → imagem 1 (corredor acesso restrito)
- `slide-logo.png`    → imagem 2 (logo Samba Hotéis)
- `slide-extrema.png` → imagem 3 (portal de Extrema)
- `slide-rota.png`    → imagem 4 (cachoeira Rota das Águas)

### 2. Links dos anúncios
Em `banner-samba.component.ts`, substitua:
```typescript
linkAnuncio1 = 'https://LINK_ANUNCIO_1';
linkAnuncio2 = 'https://LINK_ANUNCIO_2';
```

### 3. Registrar o módulo
Em `app.module.ts` (ou no módulo de destino):
```typescript
import { BannerSambaModule } from './banner-samba/banner-samba.module';

@NgModule({
  imports: [
    BannerSambaModule,
    // ...
  ]
})
```

### 4. Usar no template
```html
<app-banner-samba></app-banner-samba>
```

## Fontes necessárias (já no seu projeto se vier do Banner 1)
```html
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:wght@900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
```

## @use do SCSS compartilhado
O arquivo `banner-slide.shared.scss` deve ficar em `shared/` dentro da pasta.
Cada filho usa:
```scss
@use '../shared/banner-slide.shared' as shared;
```
Ajuste o caminho relativo conforme sua estrutura.
