# DESTINO: API-RUBY-RAILS/app/models/user.rb
# AÇÃO: SUBSTITUIR o arquivo inteiro
 
class User < ApplicationRecord
  has_secure_password

  has_many :reservas, dependent: :destroy
  has_many :hotel_reservas, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
 
  before_save { self.email = email.downcase }
 
  # Gera token de reset válido por 1 hora
  def generate_reset_password_token!
    self.reset_password_token = SecureRandom.urlsafe_base64(32)
    self.reset_password_expires_at = 1.hour.from_now
    save!
  end
 
  def reset_password_token_valid?
    reset_password_expires_at.present? && reset_password_expires_at > Time.now
  end
end
 