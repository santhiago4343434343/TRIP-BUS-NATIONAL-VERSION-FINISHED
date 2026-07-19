module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [:me]
 
      # POST /api/v1/auth/register
      def register
        user = User.new(user_params)
        if user.save
          token = JwtService.encode(user_id: user.id)
          render json: {
            message: 'Account created successfully!',
            token: token,
            user: { id: user.id, name: user.name, email: user.email }
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
 
      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email]&.downcase)
        if user&.authenticate(params[:password])
          token = JwtService.encode(user_id: user.id)
          render json: {
            message: 'Login successful!',
            token: token,
            user: { id: user.id, name: user.name, email: user.email }
          }, status: :ok
        else
          render json: { error: 'Invalid email or password.' }, status: :unauthorized
        end
      end
 
      # GET /api/v1/auth/me
      def me
        render json: {
          user: { id: @current_user.id, name: @current_user.name, email: @current_user.email }
        }, status: :ok
      end
 
      # POST /api/v1/auth/forgot_password
      def forgot_password
        user = User.find_by(email: params[:email]&.downcase)
        if user
          user.generate_reset_password_token!
          UserMailer.reset_password_email(user).deliver_now
        end
        # Always return success to avoid email enumeration attacks
        render json: { message: 'If this email is registered, a reset link has been sent.' }, status: :ok
      end
 
      # POST /api/v1/auth/reset_password
      def reset_password
        user = User.find_by(reset_password_token: params[:token])
 
        if user.nil? || !user.reset_password_token_valid?
          render json: { error: 'Invalid or expired reset link.' }, status: :unprocessable_entity
          return
        end
 
        if user.update(
          password: params[:password],
          password_confirmation: params[:password_confirmation],
          reset_password_token: nil,
          reset_password_expires_at: nil
        )
          render json: { message: 'Password updated successfully!' }, status: :ok
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
 
      private
 
      def user_params
        params.permit(:name, :email, :password, :password_confirmation, :cpf)
      end
    end
  end
end
 