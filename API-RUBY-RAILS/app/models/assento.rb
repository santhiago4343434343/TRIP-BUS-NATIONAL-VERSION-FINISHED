class Assento < ApplicationRecord
  belongs_to :trip
  belongs_to :reserva, optional: true

  validates :numero, presence: true
  # Trava de aplicação (a trava forte é o índice único [trip_id, numero] no banco).
  validates :numero, uniqueness: { scope: :trip_id, message: 'poltrona já está ocupada nesta viagem' }
end
