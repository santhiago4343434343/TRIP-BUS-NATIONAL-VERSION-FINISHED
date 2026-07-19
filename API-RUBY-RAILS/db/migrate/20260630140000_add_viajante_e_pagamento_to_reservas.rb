class AddViajanteEPagamentoToReservas < ActiveRecord::Migration[7.0]
  def change
    add_column :reservas, :nascimento,   :date   unless column_exists?(:reservas, :nascimento)
    add_column :reservas, :telefone,     :string unless column_exists?(:reservas, :telefone)
    add_column :reservas, :url_pagamento, :string unless column_exists?(:reservas, :url_pagamento)
  end
end
