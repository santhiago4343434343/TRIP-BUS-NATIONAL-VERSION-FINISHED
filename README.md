# 🚌 Trip Bus National

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Angular](https://img.shields.io/badge/angular_20-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Ruby on Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white)](https://rubyonrails.org/)
[![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Mercado Pago](https://img.shields.io/badge/Mercado%20Pago-00B1EA?style=for-the-badge&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.br/)

Plataforma de **venda de passagens de ônibus e reservas de hotel**, com pagamento online (Mercado Pago), autenticação completa, e-mails transacionais e painel administrativo. Arquitetura de serviços **dockerizados**, cada um isolado no seu container e orquestrados via Docker Compose.

---

## 📑 Índice

- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#️-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração (.env)](#️-configuração-env)
- [Como executar](#️-como-executar)
- [Portas e acessos](#-portas-e-acessos)
- [Testando pagamentos (Mercado Pago sandbox)](#-testando-pagamentos-mercado-pago-sandbox)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Comandos úteis](#-comandos-úteis)

---

## ✨ Funcionalidades

- 🚌 **Passagens de ônibus** — busca de viagens, seleção de poltronas e compra.
- 🏨 **Reservas de hotel** — reserva por período (check-in/check-out) e tipo de quarto.
- 🔐 **Autenticação completa** — cadastro, login, "esqueci a senha" / redefinir, e confirmação de e-mail (Devise + JWT).
- 💳 **Pagamento via Mercado Pago** — Checkout Pro (cartão) e PIX, com **retorno automático** (`auto_return`) e **webhook** de confirmação.
- 📧 **E-mail de confirmação** — enviado após a aprovação do pagamento (SMTP / Mailtrap).
- 🗂️ **Histórico de reservas** — passagens e hotéis, com **cancelar** e **excluir**.
- 👁️ **Mostrar/ocultar senha** — nos formulários de login, cadastro e redefinição.
- 🖥️ **Painel administrativo** — módulo em Java/Tomcat (dashboard, usuários, cancelamentos).

---

## 🏗️ Arquitetura

O sistema é dividido em serviços independentes que conversam pela rede interna do Docker:

| Serviço | Papel | Stack |
|---|---|---|
| **frontend** | Interface do usuário (SPA) | Angular 20 + Tailwind + SASS |
| **api** | Regras de negócio, auth e pagamentos | Ruby on Rails (API) |
| **admin-java** | Painel administrativo | Java + Apache Tomcat (JDBC) |
| **db** | Banco de dados central | MariaDB 10.11 |
| **phpmyadmin** | Administração visual do banco | phpMyAdmin |
| **ngrok** | Túnel público (retorno do pagamento) | ngrok |

O frontend chama a API por caminho **relativo `/api`**, que o `ng serve` faz proxy para o backend — assim o mesmo host serve a página e a API (essencial pro retorno do Mercado Pago funcionar via URL pública).

---

## 🚀 Tecnologias

- **Frontend:** Angular 20 (standalone + novo build system esbuild/Vite), Tailwind CSS, SASS, TypeScript, Font Awesome, SSR.
- **API:** Ruby on Rails (modo API), Devise + JWT, SDK do Mercado Pago.
- **Admin:** Java, Apache Tomcat, JDBC.
- **Banco:** MariaDB 10.11 + phpMyAdmin.
- **Infra:** Docker, Docker Compose, WSL2 (Ubuntu), ngrok.

---

## 📦 Pré-requisitos

- **Docker Desktop** (recomendado com integração **WSL2**).
- **Docker Compose** (já vem no Docker Desktop).
- Conta gratuita no **ngrok** (apenas se for testar o retorno automático do pagamento).
- Inbox no **Mailtrap** (sandbox) para receber os e-mails de teste.

---

## ⚙️ Configuração (.env)

Copie o modelo e preencha com os seus valores:

```bash
cp .env.example .env
```

Principais variáveis:

| Variável | Descrição |
|---|---|
| `DB_ROOT_PASSWORD`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | Credenciais do MariaDB |
| `JWT_SECRET` | Segredo para assinar os tokens JWT |
| `MP_ACCESS_TOKEN` | Token do Mercado Pago (Checkout Pro / cartão) |
| `MP_PIX_ACCESS_TOKEN` | Token do Mercado Pago (PIX) |
| `FRONTEND_URL` | URL do frontend (localhost em dev, ou a URL do ngrok para o retorno automático) |
| `MP_NOTIFICATION_URL` | URL pública do webhook do Mercado Pago (via ngrok) |
| `PIX_SIMULAR_APROVACAO` | `true` simula a aprovação de um PIX de teste (só sandbox/demo) |
| `SMTP_*` | Credenciais do Mailtrap (host, porta, usuário, senha, auth) |
| `NGROK_AUTHTOKEN` | Token da sua conta ngrok (usado pelo serviço `ngrok` do compose) |

> ⚠️ **O `.env` nunca deve ir para o Git** — ele já está no `.gitignore`. Versione apenas o `.env.example` (sem valores reais).

---

## ▶️ Como executar

```bash
# 1. Clone o repositório
git clone https://github.com/santhiago43434343/TRIP-BUS-NATIONAL-VERSION-FINISHED.git
cd TRIP-BUS-NATIONAL-VERSION-FINISHED

# 2. Configure o ambiente
cp .env.example .env      # e preencha os valores

# 3. Suba os containers
docker compose up -d

# 4. Acompanhe a compilação do frontend (aguarde "Compiled successfully")
docker compose logs -f frontend
```

Depois é só abrir **http://localhost:4300** no navegador.

> 💡 O `ng serve` leva alguns segundos para compilar na primeira vez — **espere o `Compiled successfully`** antes de abrir a página.

Para subir **enxuto** (só o essencial, economizando memória):
```bash
docker compose up -d db api frontend
```

---

## 🌐 Portas e acessos

| Serviço | URL / Porta |
|---|---|
| Frontend (site) | http://localhost:4300 |
| API (Rails) | http://localhost:3001 |
| Painel Admin (Tomcat) | http://localhost:8081 |
| phpMyAdmin | http://localhost:8082 |
| MariaDB | `localhost:3306` |

---

## 💳 Testando pagamentos (Mercado Pago sandbox)

O pagamento usa o **ambiente de teste** do Mercado Pago:

1. **Cartão (Checkout Pro):** no checkout, pague **logado com um Comprador de teste** (criado no painel do MP em *Contas de teste*), usando um **cartão de teste** com titular **`APRO`** e CPF **`12345678909`** → pagamento aprovado.
2. **PIX:** aprova via simulação (`PIX_SIMULAR_APROVACAO=true`).

### Retorno automático + e-mail (via ngrok)

O Mercado Pago **não redireciona para `localhost`**. Para o retorno automático (`auto_return`) e o webhook funcionarem, o frontend precisa estar acessível por uma **URL pública** — o serviço `ngrok` do compose cuida disso. Configure o `NGROK_AUTHTOKEN` no `.env`, aponte a `FRONTEND_URL` para o seu domínio ngrok, e acesse o site pela URL do ngrok durante o pagamento. Ao aprovar, o MP volta sozinho para o site → a reserva é confirmada → o e-mail cai no Mailtrap.

---

## 📁 Estrutura do projeto

```
TRIP-BUS-NATIONAL/
├── WEB-FRONTEND-ANGULAR/     # Frontend Angular 20 (SPA)
├── API-RUBY-RAILS/           # API em Ruby on Rails (auth, reservas, pagamentos)
├── ADMIN-JAVA-TOMCAT/        # Painel administrativo (Java/Tomcat)
├── docker-compose.yml        # Orquestração dos serviços
└── .env.example              # Modelo das variáveis de ambiente
```

---

## 🧰 Comandos úteis

```bash
docker compose ps                     # o que está rodando
docker compose logs -f frontend       # logs do frontend (Ctrl+C sai da visualização)
docker compose logs -f api            # logs da API
docker compose stop                   # pausa tudo (sem apagar dados)
docker compose down                   # derruba os containers
docker compose up -d --force-recreate frontend   # recria só o frontend
```

---

> Projeto desenvolvido para fins de estudo — integrando frontend, API, painel administrativo, banco de dados e gateway de pagamento num ambiente 100% dockerizado. 🚌💨
