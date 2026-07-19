Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # ─── Autenticação ──────────────────────────────────────────────
      scope :auth do
        post 'register',        to: 'auth#register'
        post 'login',           to: 'auth#login'
        get  'me',              to: 'auth#me'
        post 'forgot_password', to: 'auth#forgot_password'
        post 'reset_password',  to: 'auth#reset_password'
      end

      # ─── Perfil do usuário ─────────────────────────────────────────
      scope :users do
        get   'profile',        to: 'users#profile'
        patch 'update_profile', to: 'users#update_profile'
      end

      # ─── Viagens (grade de passagens) ──────────────────────────────
      resources :trips, only: [:index, :show]

      # ─── Passagens / Reservas (histórico, compra, cancelamento) ────
      resources :reservas, only: [:index, :show, :create, :destroy] do
        member do
          post :cancelar
          post :confirmar_pagamento
          post :continuar_pagamento
        end
        collection do
          post :webhook   # público: notificação do Mercado Pago
        end
      end

      # ─── Hotéis (grade de hotéis) ──────────────────────────────────
      resources :hotels, only: [:index, :show]

      # ─── Reservas de hotel (histórico, reserva, cancelamento) ──────
      resources :hotel_reservas, only: [:index, :create, :destroy] do
        member do
          post :cancelar
        end
      end

      # ─── Checkout / Pagamentos (legado e-commerce) ─────────────────
      resources :checkouts, only: [:index, :create, :update, :destroy] do
        collection do
          post :webhook
          post :paypal_webhook
        end
      end
      post 'payments/webhook', to: 'checkouts#webhook'
    end
  end
end
