require 'mercadopago'

class MercadoPagoService
  def initialize
    # Cartão / Checkout Pro. Use o token do Seller Test User para o comprador ser
    # sempre diferente do vendedor (evita "uma das partes é de teste" / pagar a si mesmo).
    @sdk = Mercadopago::SDK.new(ENV['MP_ACCESS_TOKEN'].to_s)
    # PIX (API de Pagamentos) exige credencial de TESTE (TEST-...). Sem MP_PIX_ACCESS_TOKEN,
    # cai no mesmo token do cartão.
    @sdk_pix = Mercadopago::SDK.new(ENV['MP_PIX_ACCESS_TOKEN'].presence || ENV['MP_ACCESS_TOKEN'].to_s)
  end

  # Gera o link de pagamento (checkout) para uma reserva de passagem.
  # Retorna o init_point e o id da preference (para permitir checar validade depois).
  def criar_preferencia_reserva(reserva)
    front = ENV['FRONTEND_URL'].presence || 'http://localhost:4200'

    preference_data = {
      items: [
        {
          title: "Passagem #{reserva.codigo} - #{reserva.trip.origin} -> #{reserva.trip.destination}",
          unit_price: reserva.valor.to_f,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      # Payer com e-mail FAKE e ÚNICO por reserva: força o comprador a ser um convidado de
      # teste DIFERENTE do dono do token TEST. Sem isso, o sandbox entende "pagar a si mesmo"
      # e devolve "não foi possível processar o pagamento". Essencial no cartão como convidado.
      payer: { email: "comprador.teste.#{reserva.id}@teste.com" },
      external_reference: reserva.id.to_s,
      back_urls: {
        success: "#{front}/#/pagamento-retorno",
        failure: "#{front}/#/pagamento-retorno",
        pending:  "#{front}/#/pagamento-retorno"
      }
    }

    # Opcional: só é usado se você configurar o webhook (não é necessário no modo simplificado).
    notification_url = ENV['MP_NOTIFICATION_URL'].presence
    preference_data[:notification_url] = notification_url if notification_url

    # auto_return: o MP redireciona SOZINHO pro site após aprovar (sem clicar "Voltar à loja").
    # Só com URL pública — o MP rejeita auto_return apontando pra localhost.
    preference_data[:auto_return] = 'approved' unless front.include?('localhost')

    result = @sdk.preference.create(preference_data)

    if [200, 201].include?(result[:status])
      { init_point: result[:response]['init_point'], preference_id: result[:response]['id'] }
    else
      raise "Erro ao criar preferência no Mercado Pago: #{result[:response]}"
    end
  end

  # Gera um pagamento PIX real (QR Code + copia-e-cola) para uma reserva.
  # Sandbox: o payer com first_name "APRO" faz o Mercado Pago aprovar sozinho (para teste).
  def criar_pix_reserva(reserva)
    cpf = reserva.documento.to_s.gsub(/\D/, '')
    cpf = '19119119100' if cpf.length != 11 # CPF de teste do sandbox

    payment_data = {
      transaction_amount: reserva.valor.to_f,
      description: "Passagem #{reserva.codigo} - #{reserva.trip.origin} -> #{reserva.trip.destination}",
      payment_method_id: 'pix',
      external_reference: reserva.id.to_s,
      payer: {
        email: reserva.email.presence || 'comprador@teste.com',
        first_name: 'APRO', # sandbox: aprova sozinho. Em produção, use o nome real do pagador.
        identification: { type: 'CPF', number: cpf }
      }
    }

    result    = @sdk_pix.payment.create(payment_data)
    pagamento = result[:response] || {}
    tx        = pagamento.dig('point_of_interaction', 'transaction_data') || {}

    if tx['qr_code'].present?
      { payment_id: pagamento['id'], copia_e_cola: tx['qr_code'], qr_base64: tx['qr_code_base64'] }
    else
      raise "Erro ao gerar PIX no Mercado Pago: #{pagamento}"
    end
  end

  # Verifica se uma preference ainda está ativa/válida no Mercado Pago.
  def preferencia_valida?(preference_id)
    return false if preference_id.blank?

    result = @sdk.preference.get(preference_id)
    return false unless result[:status] == 200

    expiracao = result[:response]['expiration_date_to']
    expiracao.blank? || Time.parse(expiracao) > Time.current
  rescue StandardError
    false
  end

  # Consulta um pagamento pelo id (usado para confirmar no retorno do checkout).
  # Tenta os dois tokens: cartão e PIX criam o pagamento com credenciais diferentes.
  def buscar_pagamento(payment_id)
    info = @sdk_pix.payment.get(payment_id)
    return info if info && info[:response].is_a?(Hash) && info[:response]['id']
    @sdk.payment.get(payment_id)
  rescue StandardError
    @sdk.payment.get(payment_id)
  end
end
