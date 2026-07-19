module Api
  module V1
    class UsersController < ApplicationController

      before_action :authenticate_user!

      # GET /api/v1/users/profile
      def profile
        render json: {
          user: { id: @current_user.id, name: @current_user.name, email: @current_user.email }
        }
      end

      # PATCH /api/v1/users/update_profile
      def update_profile
        if @current_user.update(update_params)
          render json: { message: 'Perfil atualizado com sucesso!' }
        else
          render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def update_params
        params.permit(:name, :email)
      end
    end
  end
end