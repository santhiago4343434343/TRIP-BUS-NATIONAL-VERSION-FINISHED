# Trip Bus National — Passagens (histórico, cancelamento e reserva de poltronas)

Resumo das correções de bugs e das 3 funcionalidades implementadas (banco MariaDB, API Ruby on Rails, frontend Angular).

---

## 1. Bugs corrigidos no backend

| # | Problema | Correção |
|---|----------|----------|
| 1 | `trips_controller.rb` com erro de sintaxe Ruby (`module api`/`module v1` minúsculos e `render json @trips` sem `:`) | Reescrito com `Api`/`V1` e `render json:` |
| 2 | `CheckoutsController` usava o model **`Order`, que não existia** (NameError) | Criados o model `Order` e a migration `create_orders` |
| 3 | Migration `20260328191930_fix_orders_table.rb]` com **nome corrompido e vazia** | Substituída por migrations válidas (ver nota de remoção abaixo) |
| 4 | `routes.rb`: ações de checkout sem rota, `force_sucess` (typo) apontando para ação inexistente | `routes.rb` reescrito e limpo |
| 5 | Frontend chamava `/cancelamentos` (sem `/api/v1` e sem backend) | Novo fluxo de reservas em `/api/v1/reservas` |
| 6 | Token do Mercado Pago **hardcoded** no código | Movido para `ENV['MP_ACCESS_TOKEN']` |
| 7 | Marca "ProwayComputers" (resíduo do template e-commerce) | Trocada por "Trip Bus National" |
| 8 | Link **PASSAGENS** no header apontava para `/tickets`, **rota inexistente** | Rota `/tickets` criada |

---

## 2. Modelo de dados (novo)

- **trips** (+ colunas): `bus_company_logo`, `arrival_time`, `total_seats` (padrão 44).
- **reservas**: `user_id`, `trip_id`, `codigo` (único, ex.: `TRIP-A1B2C3`), `passageiro`, `documento`, `email`, `valor`, `status` (`confirmada`/`cancelada`/`pendente`), `motivo_cancelamento`, `cancelada_em`.
- **assentos**: `trip_id`, `reserva_id`, `numero` — cada linha é uma poltrona **ocupada**. Índice único `[trip_id, numero]` impede reserva dupla no banco. Cancelar a reserva apaga as linhas e libera as poltronas.
- **orders**: tabela legada do checkout (corrige o bug do model `Order`).

---

## 3. Endpoints da API (Rails)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/v1/trips` | Grade de viagens (empresa, logo, preço, horários, lugares) | não |
| GET | `/api/v1/trips/:id` | Detalhe + `assentos_ocupados` (mapa de poltronas) | não |
| GET | `/api/v1/reservas` | Histórico do usuário logado | **sim** |
| POST | `/api/v1/reservas` | Cria reserva `{ reserva: { trip_id, passageiro, documento, poltronas: [12,13] } }` | **sim** |
| POST | `/api/v1/reservas/:id/cancelar` | Cancela e libera poltronas | **sim** |

A autenticação usa o JWT já existente (header `Authorization: Bearer <token>`), anexado automaticamente pelo `authInterceptor` do Angular.

---

## 4. Frontend (Angular)

- **Grade de passagens** (`/tickets`): banner da empresa + informações ao lado (origem→destino, horários, preço, lugares) e botão **Reservar**.
- **Mapa de poltronas**: modal com o desenho do ônibus (livre / selecionada / ocupada), nome do passageiro, total e confirmação.
- **Minhas passagens** (`/historico`): histórico do usuário logado, com botão de **Cancelar** nas passagens confirmadas. Acessível também pelo menu do usuário no header.
- **Cancelamentos** (`/cancelamentos`): refeito para o fluxo por login (lista as passagens canceláveis).

Arquivos novos: `services/trip.service.ts`, `services/reserva.service.ts`, `pages/historico/*`.
Arquivos reescritos: `tickets/*`, `pages/cancelamentos/cancelamentos.component.{ts,html}`, `app.routes.ts`, `app.routes.server.ts`, `header.component.html`.

---

## 5. Como rodar

### Backend (migrations + dados de exemplo)
```bash
docker compose exec api bundle exec rails db:migrate
docker compose exec api bundle exec rails db:seed
```
> Sem Docker: `cd API-RUBY-RAILS && bundle exec rails db:migrate db:seed`

O seed cria 10 viagens e um **usuário de teste**:
- **login:** `demo@tripbus.com`  **senha:** `123456`

### Frontend
O container já tem o código montado — recarregue a página, ou:
```bash
docker compose restart frontend
```
> Sem Docker: `cd WEB-FRONTEND-ANGULAR && npm install && ng serve`

### Teste rápido
1. Login com `demo@tripbus.com` / `123456`.
2. Acesse **/tickets**, escolha uma viagem e reserve poltronas.
3. Veja em **/historico** e cancele uma passagem.

---

## 6. Notas / pendências menores

- **Remover** o arquivo corrompido `API-RUBY-RAILS/db/migrate/20260328191930_fix_orders_table.rb]` (não pôde ser apagado automaticamente). O Rails já o ignora por não terminar em `.rb`, mas o ideal é excluí-lo.
- **Logos das empresas**: coloque imagens em `WEB-FRONTEND-ANGULAR/src/assets/empresas/<slug>.png` (ex.: `viacao-cometa.png`). Sem o arquivo, a grade mostra um banner estilizado com o nome da empresa (fallback automático).
- **Mercado Pago**: defina a variável de ambiente `MP_ACCESS_TOKEN` (o token fixo foi removido do código).
- **`environment.docker.ts`** usa `apiUrl: 'http://web:3000'`, que não é acessível pelo navegador (e o serviço no compose chama-se `api`, não `web`). Para acesso pelo browser use `http://localhost:3000` (já é o valor de `environment.ts`).
- O serviço antigo `services/cancelamento.service.ts` ficou **sem uso** (substituído por `reserva.service.ts`) e pode ser removido.

---

## 7. Hotéis (mesma lógica das passagens)

Replicada a mesma estrutura para hotéis, com reserva por **datas + hóspedes + tipo de quarto**.

**Backend**
- Tabelas: `hotels` (name, city, stars, price_per_night, image_url, amenities, total_rooms) e `hotel_reservas` (user, hotel, codigo, hospede, tipo_quarto, check_in/out, num_hospedes, noites, valor, status).
- Models: `Hotel` (tipos de quarto Standard/Luxo/Suíte com diária calculada por multiplicador) e `HotelReserva` (cálculo de noites, validação de datas, geração de código `HOTEL-XXXX`, cancelamento).
- Endpoints: `GET /api/v1/hotels`, `GET /api/v1/hotels/:id`, `GET/POST /api/v1/hotel_reservas`, `POST /api/v1/hotel_reservas/:id/cancelar`.
- Seed: 8 hotéis nas cidades das viagens.

**Frontend**
- `services/hotel.service.ts` e `services/hotel-reserva.service.ts`.
- Grade de hotéis em **/hotel** (banner + cidade, estrelas, comodidades, diária) com modal de reserva (check-in/out, hóspedes, tipo de quarto, total calculado por noites).
- O histórico (**/historico**) agora tem **abas Ônibus / Hotéis**, com cancelamento em cada uma.
- Rota `/hotel` criada (corrige o link **HOTÉIS** do header, que antes dava 404).

**Logos dos hotéis:** coloque imagens em `WEB-FRONTEND-ANGULAR/src/assets/hoteis/<slug>.jpg` (ex.: `copacabana-mar.jpg`). Sem o arquivo, aparece um banner estilizado com o nome do hotel.

> Após adicionar os hotéis, rode novamente: `rails db:migrate` + `rails db:seed` e reinicie o frontend.
