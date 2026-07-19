module Api
  module V1
    class HotelsController < ApplicationController
      # GET /api/v1/hotels  -> grade de hotéis
      def index
        hotels = Hotel.order(:name)
        render json: hotels.map { |h| serialize(h) }
      end

      # GET /api/v1/hotels/:id  -> detalhe + tipos de quarto
      def show
        hotel = Hotel.find(params[:id])
        render json: serialize(hotel)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Hotel não encontrado' }, status: :not_found
      end

      private

      def serialize(h)
        {
          id: h.id,
          name: h.name,
          city: h.city,
          address: h.address,
          stars: h.stars,
          price_per_night: h.price_per_night,
          image_url: h.image_url,
          description: h.description,
          amenities: h.lista_comodidades,
          room_types: h.tipos_de_quarto,
          total_rooms: h.total_rooms
        }
      end
    end
  end
end
