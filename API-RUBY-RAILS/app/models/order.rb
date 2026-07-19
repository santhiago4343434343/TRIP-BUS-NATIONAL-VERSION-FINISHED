# Model legado do fluxo de checkout/pagamento (e-commerce reaproveitado).
# Existe para que o CheckoutsController funcione sem NameError.
# O fluxo de passagens de ônibus usa o model Reserva.
class Order < ApplicationRecord
end
