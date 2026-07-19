class ApplicationController < ActionController::API

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    payload = JwtService.decode(token)

    if payload
      @current_user = User.find_by(id: payload[:user_id])
      render json: { error: 'Usuário não encontrado' }, status: :unauthorized unless @current_user
    else
      render json: { error: 'Token inválido ou expirado' }, status: :unauthorized
    end
  end

end