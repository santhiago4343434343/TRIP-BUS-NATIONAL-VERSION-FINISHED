# Banner Samba — Standalone (Angular 17+)

## ✅ O que foi corrigido

| Problema antigo              | Solução aplicada                          |
|-----------------------------|-------------------------------------------|
| `NgModule` incompatível     | Removido — cada componente é `standalone` |
| `@use '../shared/...'`       | Removido — keyframes inline em cada SCSS  |
| `*ngFor` (módulo antigo)    | Substituído por `@for` (Angular 17+)      |
| `declarations: [...]`       | Substituído por `imports: [...]`          |

---

## 📁 Estrutura de pastas

```
src/app/components/
└── banner-samba/
    ├── banner-samba.component.ts      ← pai (standalone)
    ├── banner-samba.component.html
    ├── banner-samba.component.scss
    └── slides/
        ├── slide-acesso.component.ts
        ├── slide-acesso.component.html
        ├── slide-acesso.component.scss
        ├── slide-logo.component.ts
        ├── slide-logo.component.html
        ├── slide-logo.component.scss
        ├── slide-extrema.component.ts
        ├── slide-extrema.component.html
        ├── slide-extrema.component.scss
        ├── slide-rota.component.ts
        ├── slide-rota.component.html
        └── slide-rota.component.scss
```

---

## 🚀 Como usar em belo-horizonte.component.ts

```typescript
import { BannerSambaComponent } from '@app/components/banner-samba/banner-samba.component';

@Component({
  selector: 'app-belo-horizonte',
  standalone: true,
  imports: [BannerSambaComponent],  // ← apenas o pai!
  templateUrl: './belo-horizonte.component.html',
  styleUrls: ['./belo-horizonte.component.scss']
})
```

## No template belo-horizonte.component.html

```html
<app-banner-samba></app-banner-samba>
```

---

## 🖼️ Imagens necessárias

Coloque em `src/assets/banner/`:
- `slide-acesso.png`
- `slide-logo.png`
- `slide-extrema.png`
- `slide-rota.png`

---

## 🔤 Fontes (adicione no index.html)

```html
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:wght@900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
```
