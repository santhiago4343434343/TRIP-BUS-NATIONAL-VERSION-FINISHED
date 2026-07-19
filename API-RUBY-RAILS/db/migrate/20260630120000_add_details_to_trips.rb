class AddDetailsToTrips < ActiveRecord::Migration[7.0]
  def change
    add_column :trips, :bus_company_logo, :string unless column_exists?(:trips, :bus_company_logo)
    add_column :trips, :arrival_time, :datetime    unless column_exists?(:trips, :arrival_time)
    add_column :trips, :total_seats, :integer, default: 44 unless column_exists?(:trips, :total_seats)
  end
end
