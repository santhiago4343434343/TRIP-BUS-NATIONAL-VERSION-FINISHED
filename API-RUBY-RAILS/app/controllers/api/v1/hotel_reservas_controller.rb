module Api
  module V1
    # Reservas de hotel do usuário logado: histórico, reserva e cancelamento.
    class HotelReservasController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/hotel_reservas  -> histórico de hotéis do usuário
      def index
        reservas = @current_user.hotel_reservas
                                .includes(:hotel)
                                .order(created_at: :desc)
        render json: reservas.map { |r| serialize(r) }
      end

      # POST /api/v1/hotel_reservas
      # Body: { hotel_reserva: { hotel_id, hospede, tipo_quarto, check_in, check_out, num_hospedes } }
      def create
        hotel = Hotel.find(reserva_params[:hotel_id])
        tipo = reserva_params[:tipo_quarto].presence || 'Standard'
        check_in  = parse_date(reserva_params[:check_in])
        check_out = parse_date(reserva_params[:check_out])

        if check_in.nil? || check_out.nil?
          return render json: { error: 'Informe as datas de check-in e check-out.' }, status: :unprocessable_entity
        end
        if check_out <= check_in
          return render json: { error: 'O check-out deve ser depois do check-in.' }, status: :unprocessable_entity
        end

        noites = (check_out - check_in).to_i
        valor = hotel.diaria_para(tipo) * noites

        reserva = @current_user.hotel_reservas.new(
          hotel: hotel,
          hospede: reserva_params[:hospede].presence || @current_user.name,
          tipo_quarto: tipo,
          check_in: check_in,
          check_out: check_out,
          num_hospedes: (reserva_params[:num_hospedes].presence || 1).to_i,
          valor: valor,
          status: 'confirmada'
        )

        if reserva.save
          render json: serialize(reserva), status: :created
        else
          render json: { error: reserva.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Hotel não encontrado' }, status: :not_found
      end

      # POST /api/v1/hotel_reservas/:id/cancelar
      def cancelar
        reserva = @current_user.hotel_reservas.find(params[:id])

        if reserva.status == 'cancelada'
          return render json: { error: 'Esta reserva já está cancelada.' }, status: :unprocessable_entity
        end

        reserva.cancelar!(params[:motivo])
        render json: serialize(reserva)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Reserva não encontrada' }, status: :not_found
      end

      # DELETE /api/v1/hotel_reservas/:id  -> remove a reserva de hotel do histórico do usuário.
      def destroy
        reserva = @current_user.hotel_reservas.find(params[:id])
        reserva.destroy
        render json: { message: 'Reserva excluída', id: reserva.id }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Reserva não encontrada' }, status: :not_found
      end

      private

      def reserva_params
        params.require(:hotel_reserva).permit(
          :hotel_id, :hospede, :tipo_quarto, :check_in, :check_out, :num_hospedes
        )
      end

      def parse_date(valor)
        return nil if valor.blank?

        Date.parse(valor.to_s)
      rescue ArgumentError
        nil
      end

      def serialize(reserva)
        hotel = reserva.hotel
        {
          id: reserva.id,
          codigo: reserva.codigo,
          hospede: reserva.hospede,
          tipo_quarto: reserva.tipo_quarto,
          check_in: reserva.check_in,
          check_out: reserva.check_out,
          num_hospedes: reserva.num_hospedes,
          noites: reserva.noites,
          valor: reserva.valor,
          status: reserva.status,
          motivo_cancelamento: reserva.motivo_cancelamento,
          cancelada_em: reserva.cancelada_em,
          created_at: reserva.created_at,
          hotel: {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            stars: hotel.stars,
            image_url: hotel.image_url
          }
        }
      end
    end
  end
end
