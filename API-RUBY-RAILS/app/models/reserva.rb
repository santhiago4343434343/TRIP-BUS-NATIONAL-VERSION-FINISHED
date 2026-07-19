class Reserva < ApplicationRecord
  belongs_to :user
  belongs_to :trip
  has_many :assentos, dependent: :destroy

  STATUS = %w[confirmada cancelada pendente].freeze

  validates :passageiro, presence: true
  validates :status, inclusion: { in: STATUS }
  validates :codigo, uniqueness: true, allow_nil: true

  before_validation :gerar_codigo, on: :create
  before_validation :definir_status_padrao, on: :create

  # Números das poltronas desta reserva.
  def numeros_poltronas
    assentos.order(:numero).pluck(:numero)
  end

  # Cancela a passagem e libera as poltronas (remove os assentos ocupados).
  def cancelar!(motivo = nil)
    transaction do
      update!(
        status: 'cancelada',
        motivo_cancelamento: motivo.presence || 'Cancelamento solicitado pelo usuário',
        cancelada_em: Time.current
      )
      assentos.destroy_all
    end
  end

  private

  def gerar_codigo
    return if codigo.present?

    loop do
      self.codigo = "TRIP-#{SecureRandom.hex(3).upcase}"
      break unless Reserva.exists?(codigo: codigo)
    end
  end

  def definir_status_padrao
    self.status = 'confirmada' if status.blank?
  end
end
