require 'mercadopago'

module Api
  module V1
    class CheckoutsController < ApplicationController
      skip_before_action :verify_authenticity_token

      # Listar todos os pedidos
      def index
        @pedidos = Order.all.order(created_at: :desc)
        render json: @pedidos
      end

      # Criar um novo pedido (Início do Checkout)
      def create
        @pedido = Order.new(checkout_params)
        @pedido.user_id = 1 if @pedido.user_id.nil?
        @pedido.status ||= 'pendente'

        if @pedido.save
          case @pedido.payment
          when 'mercadopago'
            configurar_mercado_pago
          when 'pix'
            gerar_pix_estatico
          else
            render json: @pedido, status: :created
          end
        else
          render json: @pedido.errors, status: :unprocessable_entity
        end
      end

      # --- WEBHOOK MERCADO PAGO ---
      def webhook
        payment_id = params.dig(:data, :id) || params[:id]
        
        if payment_id && (params[:type] == 'payment' || params[:action].to_s.include?('payment'))
          token = ENV['MP_ACCESS_TOKEN']
          sdk = Mercadopago::SDK.new(token)
          payment_info = sdk.payment.get(payment_id)
          
          if payment_info[:response]
            status_real = payment_info[:response]['status']
            pedido_id = payment_info[:response]['external_reference']
            @pedido = Order.find_by(id: pedido_id)

            if @pedido && status_real == 'approved' && @pedido.status != 'pago'
              @pedido.update(status: 'pago')
              PedidoMailer.confirmacao_pagamento(@pedido).deliver_later
              puts "📧 E-mail de confirmação enviado (Mercado Pago) para #{@pedido.emailCliente}"
            end
          end
        end
        head :ok 
      end

      # --- WEBHOOK PAYPAL ---
      def paypal_webhook
        evento = params[:event_type]
        recurso = params[:resource]

        if evento == "PAYMENT.CAPTURE.COMPLETED" || evento == "PAYMENTS.PAYMENT.CREATED"
          pedido_id = recurso[:custom_id] || recurso[:invoice_number]
          @pedido = Order.find_by(id: pedido_id)

          if @pedido && @pedido.status != 'pago'
            @pedido.update(status: 'pago')
            PedidoMailer.confirmacao_pagamento(@pedido).deliver_later
            puts "📧 E-mail de confirmação enviado (PayPal) para #{@pedido.emailCliente}"
          end
        end
        head :ok 
      end

      # Atualizar status do pedido manualmente (Chamado pelo Angular)
      def update
        @pedido = Order.find_by(id: params[:id])
        if @pedido
          novo_status = params.dig(:checkout, :status) || params[:status]
          
          if @pedido.update(status: novo_status)
            if novo_status == 'pago'
              PedidoMailer.confirmacao_pagamento(@pedido).deliver_later
              puts "📧 E-mail disparado manualmente via Update para #{@pedido.emailCliente}"
            end
            render json: { message: "Status atualizado!", pedido: @pedido }, status: :ok
          else
            render json: { error: "Erro ao salvar" }, status: :unprocessable_entity
          end
        else
          render json: { error: "Pedido não encontrado" }, status: :not_found
        end
      end

      # Remover pedido
      def destroy
        @pedido = Order.find_by(id: params[:id])
        if @pedido
          @pedido.destroy
          render json: { message: "Pedido ##{params[:id]} removido" }, status: :ok
        else
          render json: { error: "Pedido não encontrado" }, status: :not_found
        end
      end

      private

      def checkout_params
        params.require(:checkout).permit(:total, :user_id, :status, :emailCliente, :address, :cart, :delivery, :payment, :url_pagamento)
      end

      def configurar_mercado_pago
        token = ENV['MP_ACCESS_TOKEN']
        sdk = Mercadopago::SDK.new(token)

        preference_data = {
          "items" => [{
            "title" => "Pedido ##{@pedido.id} - Trip Bus National",
            "unit_price" => @pedido.total.to_f,
            "quantity" => 1,
            "currency_id" => "BRL"
          }],
          "external_reference" => @pedido.id.to_s,
          "notification_url" => "https://combinative-rita-nonconspiratorial.ngrok-free.dev/api/v1/checkouts/webhook"
        }

        response = sdk.preference.create(preference_data)
        url_mp = response[:response]['init_point']

        if url_mp
          @pedido.update_columns(url_pagamento: url_mp)
          render json: { id: @pedido.id, url_pagamento: url_mp, status: @pedido.status }, status: :created
        else
          render json: { error: "Erro ao gerar link MP" }, status: :bad_request
        end
      end

      def gerar_pix_estatico
        render json: { 
          id: @pedido.id, 
          status: @pedido.status, 
          pix_copia_e_cola: "00020126360014BR.GOV.BCB.PIX..." 
        }, status: :created
      end
    end
  end
end