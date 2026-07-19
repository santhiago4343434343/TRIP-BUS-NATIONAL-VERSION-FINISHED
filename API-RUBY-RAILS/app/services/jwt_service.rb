class JwtService
  SECRET_KEY = Rails.application.secret_key_base

  def self.encode(user_id:)
    payload = {
      user_id: user_id,
      exp:     24.hours.from_now.to_i,
      iat:     Time.now.to_i
    }
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
    HashWithIndifferentAccess.new(decoded.first)
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end