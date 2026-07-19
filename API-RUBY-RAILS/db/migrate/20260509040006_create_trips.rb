class CreateTrips < ActiveRecord::Migration[7.0]
  def change
    create_table :trips do |t|
      t.string :bus_company
      t.string :origin
      t.string :destination
      t.datetime :departure_time
      t.decimal :price
      t.integer :seats_available

      t.timestamps
    end
  end
end
