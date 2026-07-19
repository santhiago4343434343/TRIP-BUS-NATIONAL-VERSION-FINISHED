class CreateReservas < ActiveRecord::Migration[7.0]
  def change
    return if table_exists?(:reservas)

    create_table :reservas do |t|
      t.references :user, null: false, foreign_key: true
      t.references :trip, null: false, foreign_key: true
      t.string   :codigo
      t.string   :passageiro
      t.string   :documento
      t.string   :email
      t.decimal  :valor, precision: 10, scale: 2, default: 0
      t.string   :status, default: 'confirmada'
      t.string   :motivo_cancelamento
      t.datetime :cancelada_em

      t.timestamps
    end

    add_index :reservas, :codigo, unique: true
  end
end
