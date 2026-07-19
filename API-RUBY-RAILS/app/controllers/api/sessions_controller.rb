# DESTINO: app/controllers/api/sessions_controller.rb
class Api::SessionsController < ApplicationController
  # Se seu ApplicationController herda de ActionController::Base (e não ::API),
  # descomente a linha abaixo para liberar o POST via JSON:
  # skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email]&.downcase&.strip)

    if user&.authenticate(params[:senha])
      token = JWT.encode(
        { user_id: user.id, exp: 24.hours.from_now.to_i },
        Rails.application.secret_key_base
      )
      render json: {
        token: token,
        user: { id: user.id, nome: user.nome, email: user.email }
      }, status: :ok
    else
      render json: { erro: 'E-mail ou senha inválidos' }, status: :unauthorized
    end
  end
end
