class HotelReserva < ApplicationRecord
  belongs_to :user
  belongs_to :hotel

  STATUS = %w[confirmada cancelada pendente].freeze

  validates :hospede, presence: true
  validates :status, inclusion: { in: STATUS }
  validates :codigo, uniqueness: true, allow_nil: true
  validate :datas_validas

  before_validation :calcular_noites
  before_validation :gerar_codigo, on: :create
  before_validation :definir_status_padrao, on: :create

  # Cancela a reserva de hotel.
  def cancelar!(motivo = nil)
    update!(
      status: 'cancelada',
      motivo_cancelamento: motivo.presence || 'Cancelamento solicitado pelo usuário',
      cancelada_em: Time.current
    )
  end

  private

  def calcular_noites
    if check_in.present? && check_out.present? && check_out > check_in
      self.noites = (check_out - check_in).to_i
    end
  end

  def datas_validas
    return if check_in.blank? || check_out.blank?

    errors.add(:check_out, 'deve ser depois do check-in') if check_out <= check_in
  end

  def gerar_codigo
    return if codigo.present?

    loop do
      self.codigo = "HOTEL-#{SecureRandom.hex(3).upcase}"
      break unless HotelReserva.exists?(codigo: codigo)
    end
  end

  def definir_status_padrao
    self.status = 'confirmada' if status.blank?
  end
end
