class ReservaMailer < ApplicationMailer
  default from: 'contato@tripbusnational.com'

  # Confirmação de pagamento de uma passagem (reserva).
  # O e-mail vai para o endereço salvo na reserva.
  def confirmacao_pagamento(reserva)
    @reserva = reserva
    @trip    = reserva.trip
    mail(to: @reserva.email, subject: "Pagamento confirmado - Passagem #{@reserva.codigo}")
  end
end
