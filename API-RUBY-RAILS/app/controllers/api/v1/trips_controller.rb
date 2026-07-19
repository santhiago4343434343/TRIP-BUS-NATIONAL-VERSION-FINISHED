module Api
  module V1
    class TripsController < ApplicationController
      # GET /api/v1/trips
      # Lista as viagens para a grade de passagens (banner + informações).
      def index
        trips = Trip.order(:departure_time)
        ocupados = Assento.group(:trip_id).count # { trip_id => qtd_ocupada }

        render json: trips.map { |trip|
          capacidade = trip.total_de_assentos
          serialize_trip(trip).merge(
            seats_available: capacidade - ocupados[trip.id].to_i
          )
        }
      end

      # GET /api/v1/trips/:id
      # Detalhe da viagem + poltronas ocupadas (para montar o mapa de assentos).
      def show
        trip = Trip.find(params[:id])
        ocupados = trip.assentos_ocupados

        render json: serialize_trip(trip).merge(
          seats_available: trip.total_de_assentos - ocupados.size,
          assentos_ocupados: ocupados
        )
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Viagem não encontrada' }, status: :not_found
      end

      private

      def serialize_trip(trip)
        {
          id: trip.id,
          bus_company: trip.bus_company,
          bus_company_logo: trip.bus_company_logo,
          origin: trip.origin,
          destination: trip.destination,
          departure_time: trip.departure_time,
          arrival_time: trip.arrival_time,
          price: trip.price,
          total_seats: trip.total_de_assentos
        }
      end
    end
  end
end
