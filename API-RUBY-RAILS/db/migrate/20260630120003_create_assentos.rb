class CreateAssentos < ActiveRecord::Migration[7.0]
  # Cada linha representa uma poltrona OCUPADA de uma viagem.
  # A existência da linha = assento reservado. Ao cancelar a reserva,
  # as linhas são removidas e as poltronas voltam a ficar livres.
  def change
    return if table_exists?(:assentos)

    create_table :assentos do |t|
      t.references :trip,    null: false, foreign_key: true
      t.references :reserva, foreign_key: true
      t.integer    :numero, null: false

      t.timestamps
    end

    # Impede duas reservas na mesma poltrona da mesma viagem (trava no banco).
    add_index :assentos, [:trip_id, :numero], unique: true
  end
end
