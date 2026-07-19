class CreateHotels < ActiveRecord::Migration[7.0]
  def change
    return if table_exists?(:hotels)

    create_table :hotels do |t|
      t.string  :name
      t.string  :city
      t.string  :address
      t.integer :stars, default: 3
      t.decimal :price_per_night, precision: 10, scale: 2, default: 0
      t.string  :image_url
      t.text    :description
      t.string  :amenities          # "Wi-Fi, Café da manhã, Piscina"
      t.integer :total_rooms, default: 30

      t.timestamps
    end
  end
end
