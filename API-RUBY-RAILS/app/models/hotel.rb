class Hotel < ApplicationRecord
  has_many :hotel_reservas, dependent: :destroy

  # Tipos de quarto: multiplicador sobre a diária base + capacidade de hóspedes.
  ROOM_TYPES = {
    'Standard' => { multiplicador: 1.0, capacidade: 2 },
    'Luxo'     => { multiplicador: 1.6, capacidade: 3 },
    'Suíte'    => { multiplicador: 2.2, capacidade: 4 }
  }.freeze

  # Diária de um tipo de quarto.
  def diaria_para(tipo)
    cfg = ROOM_TYPES[tipo] || ROOM_TYPES['Standard']
    (price_per_night.to_d * cfg[:multiplicador]).round(2)
  end

  # Tipos de quarto com preço já calculado (para o frontend).
  def tipos_de_quarto
    ROOM_TYPES.map do |nome, cfg|
      { nome: nome, preco_diaria: diaria_para(nome), capacidade: cfg[:capacidade] }
    end
  end

  # Comodidades como lista (a partir do campo "amenities" separado por vírgula).
  def lista_comodidades
    (amenities || '').split(',').map(&:strip).reject(&:blank?)
  end
end
