module Api
  # BaseController para todos os endpoints da API.
  # Herda de ActionController::API (sem cookies, views, CSRF) e
  # disponibiliza autenticação JWT para os controllers filhos.
  class BaseController < ActionController::API

    # ─── Helpers disponíveis para subclasses ───────────────────────────────
    attr_reader :current_user

    # Chamado como before_action nos controllers que exigem login
    def authenticate_user!
      token   = extract_token_from_header
      payload = JwtService.decode(token)
      @current_user = User.find(payload[:user_id])
    rescue JWT::ExpiredSignature
      render json: { error: 'Token expirado. Faça login novamente.' }, status: :unauthorized
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Token inválido.' }, status: :unauthorized
    end

    private

    # Extrai o Bearer token do cabeçalho Authorization
    def extract_token_from_header
      header = request.headers['Authorization']
      raise JWT::DecodeError, 'Authorization header ausente' if header.blank?

      # Aceita "Bearer <token>" ou somente "<token>"
      header.start_with?('Bearer ') ? header.split(' ').last : header
    end
  end
end
