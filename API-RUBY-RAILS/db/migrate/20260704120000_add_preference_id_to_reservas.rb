class AddPreferenceIdToReservas < ActiveRecord::Migration[7.0]
  def change
    add_column :reservas, :preference_id, :string unless column_exists?(:reservas, :preference_id)
  end
end
