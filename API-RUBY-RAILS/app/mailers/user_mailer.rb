# DESTINO: API-RUBY-RAILS/app/mailers/user_mailer.rb
# AÇÃO: CRIAR arquivo novo
 
class UserMailer < ApplicationMailer
  default from: 'no-reply@tripbus.com'
 
  def reset_password_email(user)
    @user = user
    @reset_url = "http://localhost:4200/#/reset-password?token=#{user.reset_password_token}"
    mail(to: @user.email, subject: 'Trip Bus National — Reset your password')
  end
end
 