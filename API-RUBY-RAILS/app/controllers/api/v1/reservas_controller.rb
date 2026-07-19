module Api
  module V1
    # Passagens (reservas) do usuário logado: histórico, compra, pagamento e cancelamento.
    class ReservasController < ApplicationController
      before_action :authenticate_user!, except: [:webhook]

      # GET /api/v1/reservas  -> histórico do usuário logado
      def index
        reservas = @current_user.reservas
                                .includes(:trip, :assentos)
                                .order(created_at: :desc)
        render json: reservas.map { |r| serialize(r) }
      end

      # GET /api/v1/reservas/:id
      def show
        reserva = @current_user.reservas.find(params[:id])
        render json: serialize(reserva)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Passagem não encontrada' }, status: :not_found
      end

      # POST /api/v1/reservas
      # Body: { reserva: { trip_id, passageiro, documento, nascimento, telefone, email, poltronas: [], payment } }
      def create
        trip = Trip.find(reserva_params[:trip_id])
        poltronas = Array(reserva_params[:poltronas]).map(&:to_i).uniq.reject(&:zero?)

        if poltronas.empty?
          return render json: { error: 'Selecione ao menos uma poltrona.' }, status: :unprocessable_entity
        end

        capacidade = trip.total_de_assentos
        if poltronas.any? { |n| n < 1 || n > capacidade }
          return render json: { error: "Poltrona fora do limite (1 a #{capacidade})." }, status: :unprocessable_entity
        end

        conflito = poltronas & trip.assentos_ocupados
        if conflito.any?
          return render json: { error: "Poltrona(s) já ocupada(s): #{conflito.join(', ')}." }, status: :unprocessable_entity
        end

        reserva = @current_user.reservas.new(
          trip: trip,
          passageiro: reserva_params[:passageiro].presence || @current_user.name,
          documento: reserva_params[:documento],
          nascimento: reserva_params[:nascimento],
          telefone: reserva_params[:telefone],
          email: reserva_params[:email].presence || @current_user.email,
          valor: (trip.price.to_d * poltronas.size),
          status: pagamento_online? ? 'pendente' : 'confirmada'
        )

        ActiveRecord::Base.transaction do
          reserva.save!
          poltronas.each { |numero| reserva.assentos.create!(trip: trip, numero: numero) }
        end

        # Pagamento online: gera o checkout do Mercado Pago (cartão) ou o PIX (QR Code).
        if pagamento_mp?
          begin
            preferencia = MercadoPagoService.new.criar_preferencia_reserva(reserva)
            reserva.update_columns(url_pagamento: preferencia[:init_point], preference_id: preferencia[:preference_id])
          rescue => e
            Rails.logger.error("Erro Mercado Pago: #{e.message}")
            return render json: serialize(reserva).merge(erro_pagamento: e.message), status: :created
          end
        elsif pagamento_pix?
          begin
            pix = MercadoPagoService.new.criar_pix_reserva(reserva)
            return render json: serialize(reserva).merge(
              pix_payment_id:   pix[:payment_id],
              pix_copia_e_cola: pix[:copia_e_cola],
              pix_qr_base64:    pix[:qr_base64]
            ), status: :created
          rescue => e
            Rails.logger.error("Erro PIX Mercado Pago: #{e.message}")
            return render json: serialize(reserva).merge(erro_pagamento: e.message), status: :created
          end
        end

        render json: serialize(reserva), status: :created
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Viagem não encontrada' }, status: :not_found
      rescue ActiveRecord::RecordNotUnique
        render json: { error: 'Uma das poltronas acabou de ser reservada. Atualize e tente novamente.' }, status: :conflict
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /api/v1/reservas/:id/confirmar_pagamento
      # Body: { payment_id }  -> chamado quando o usuário volta do checkout do Mercado Pago.
      # Verifica o pagamento direto na API do MP (chamada de saída, não precisa de webhook/ngrok).
      def confirmar_pagamento
        reserva = @current_user.reservas.find(params[:id])
        payment_id = params[:payment_id]

        if payment_id.present?
          info = MercadoPagoService.new.buscar_pagamento(payment_id)
          resp = info[:response]
          aprovado = resp &&
                     resp['status'] == 'approved' &&
                     resp['external_reference'].to_s == reserva.id.to_s

          # SANDBOX: o PIX de teste do MP não pode ser pago de verdade. Com
          # PIX_SIMULAR_APROVACAO=true, aprova um PIX pendente DESTA reserva (NUNCA em produção).
          if !aprovado && ENV['PIX_SIMULAR_APROVACAO'].to_s == 'true' &&
             resp && resp['payment_method_id'] == 'pix' &&
             resp['external_reference'].to_s == reserva.id.to_s &&
             %w[pending in_process].include?(resp['status'])
            aprovado = true
          end

          if aprovado
            # Só dispara o e-mail na PRIMEIRA confirmação (evita reenvio a cada retorno).
            if reserva.status != 'confirmada'
              reserva.update(status: 'confirmada')
              ReservaMailer.confirmacao_pagamento(reserva).deliver_later
              Rails.logger.info("Passagem #{reserva.codigo} confirmada; e-mail para #{reserva.email}")
            end
            return render json: serialize(reserva)
          end
        end

        render json: { error: 'Pagamento ainda não aprovado.', reserva: serialize(reserva) },
               status: :unprocessable_entity
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Passagem não encontrada' }, status: :not_found
      rescue => e
        render json: { error: e.message }, status: :bad_gateway
      end

      # POST /api/v1/reservas/:id/continuar_pagamento
      # Reabre o link de pagamento de uma passagem pendente. Se o link salvo
      # já expirou no Mercado Pago, gera uma nova preference automaticamente.
      def continuar_pagamento
        reserva = @current_user.reservas.find(params[:id])

        unless reserva.status == 'pendente'
          return render json: { error: 'Esta passagem não está com pagamento pendente.' },
                        status: :unprocessable_entity
        end

        servico = MercadoPagoService.new

        if reserva.url_pagamento.blank? || !servico.preferencia_valida?(reserva.preference_id)
          preferencia = servico.criar_preferencia_reserva(reserva)
          reserva.update!(url_pagamento: preferencia[:init_point], preference_id: preferencia[:preference_id])
        end

        render json: serialize(reserva)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Passagem não encontrada' }, status: :not_found
      rescue => e
        render json: { error: e.message }, status: :bad_gateway
      end

      # POST /api/v1/reservas/:id/cancelar
      def cancelar
        reserva = @current_user.reservas.find(params[:id])

        if reserva.status == 'cancelada'
          return render json: { error: 'Esta passagem já está cancelada.' }, status: :unprocessable_entity
        end

        reserva.cancelar!(params[:motivo])
        render json: serialize(reserva)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Passagem não encontrada' }, status: :not_found
      end

      # DELETE /api/v1/reservas/:id  -> remove a passagem do histórico do usuário.
      # Os assentos são removidos junto (has_many :assentos, dependent: :destroy).
      def destroy
        reserva = @current_user.reservas.find(params[:id])
        reserva.destroy
        render json: { message: 'Passagem excluída', id: reserva.id }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Passagem não encontrada' }, status: :not_found
      end

      # POST /api/v1/reservas/webhook  (público — chamado pelo Mercado Pago)
      # Confirma a reserva consultando a API do MP. NÃO depende do redirect pro site,
      # então funciona mesmo em localhost (via túnel ngrok apontado em MP_NOTIFICATION_URL).
      def webhook
        payment_id = params.dig(:data, :id) || params[:id]

        if payment_id && (params[:type] == 'payment' || params[:action].to_s.include?('payment'))
          info = MercadoPagoService.new.buscar_pagamento(payment_id)
          resp = info[:response]

          if resp.is_a?(Hash) && resp['status'] == 'approved'
            reserva = Reserva.find_by(id: resp['external_reference'])
            if reserva && reserva.status != 'confirmada'
              reserva.update(status: 'confirmada')
              ReservaMailer.confirmacao_pagamento(reserva).deliver_later
              Rails.logger.info("[webhook MP] Passagem #{reserva.codigo} confirmada; e-mail para #{reserva.email}")
            end
          end
        end

        head :ok
      rescue StandardError => e
        Rails.logger.error("[webhook MP] erro: #{e.message}")
        head :ok   # sempre 200 pro MP não ficar reenviando
      end

      private

      def pagamento_mp?
        reserva_params[:payment].to_s == 'mercadopago'
      end

      def pagamento_pix?
        reserva_params[:payment].to_s == 'pix'
      end

      def pagamento_online?
        pagamento_mp? || pagamento_pix?
      end

      def reserva_params
        params.require(:reserva).permit(
          :trip_id, :passageiro, :documento, :nascimento, :telefone, :email, :payment,
          poltronas: []
        )
      end

      def serialize(reserva)
        trip = reserva.trip
        {
          id: reserva.id,
          codigo: reserva.codigo,
          passageiro: reserva.passageiro,
          documento: reserva.documento,
          nascimento: reserva.nascimento,
          telefone: reserva.telefone,
          valor: reserva.valor,
          status: reserva.status,
          poltronas: reserva.numeros_poltronas,
          url_pagamento: reserva.url_pagamento,
          motivo_cancelamento: reserva.motivo_cancelamento,
          cancelada_em: reserva.cancelada_em,
          created_at: reserva.created_at,
          trip: {
            id: trip.id,
            bus_company: trip.bus_company,
            bus_company_logo: trip.bus_company_logo,
            origin: trip.origin,
            destination: trip.destination,
            departure_time: trip.departure_time,
            arrival_time: trip.arrival_time,
            price: trip.price
          }
        }
      end
    end
  end
end
