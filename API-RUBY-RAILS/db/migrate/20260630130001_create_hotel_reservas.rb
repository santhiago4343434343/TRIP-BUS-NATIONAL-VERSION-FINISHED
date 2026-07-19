class CreateHotelReservas < ActiveRecord::Migration[7.0]
  def change
    return if table_exists?(:hotel_reservas)

    create_table :hotel_reservas do |t|
      t.references :user,  null: false, foreign_key: true
      t.references :hotel, null: false, foreign_key: true
      t.string   :codigo
      t.string   :hospede
      t.string   :tipo_quarto
      t.date     :check_in
      t.date     :check_out
      t.integer  :num_hospedes, default: 1
      t.integer  :noites
      t.decimal  :valor, precision: 10, scale: 2, default: 0
      t.string   :status, default: 'confirmada'
      t.string   :motivo_cancelamento
      t.datetime :cancelada_em

      t.timestamps
    end

    add_index :hotel_reservas, :codigo, unique: true
  end
end
