class CreateOrders < ActiveRecord::Migration[7.0]
  # Tabela legada do fluxo de checkout/pagamento (Mercado Pago / PayPal / Pix).
  # O CheckoutsController referencia o model Order, que antes não existia
  # (causando NameError). Esta migration corrige esse bug.
  def change
    return if table_exists?(:orders)

    create_table :orders do |t|
      t.decimal :total, precision: 10, scale: 2, default: 0
      t.integer :user_id
      t.string  :status, default: 'pendente'
      t.string  :emailCliente
      t.string  :address
      t.text    :cart
      t.string  :delivery
      t.string  :payment
      t.text    :url_pagamento

      t.timestamps
    end
  end
end
