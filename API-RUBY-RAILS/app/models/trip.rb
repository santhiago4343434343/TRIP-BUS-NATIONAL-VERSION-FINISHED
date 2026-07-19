class Trip < ApplicationRecord
  has_many :reservas, dependent: :destroy
  has_many :assentos, dependent: :destroy

  TOTAL_SEATS_DEFAULT = 44

  # Capacidade total de poltronas da viagem.
  def total_de_assentos
    (total_seats.presence || TOTAL_SEATS_DEFAULT).to_i
  end

  # Lista dos números de poltrona já ocupados (reservados).
  def assentos_ocupados
    assentos.order(:numero).pluck(:numero)
  end

  # Quantidade de poltronas ainda disponíveis.
  def lugares_disponiveis
    total_de_assentos - assentos.count
  end
end
