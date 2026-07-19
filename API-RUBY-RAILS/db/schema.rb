# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_07_04_120000) do
  create_table "assentos", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.bigint "reserva_id"
    t.integer "numero", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reserva_id"], name: "index_assentos_on_reserva_id"
    t.index ["trip_id", "numero"], name: "index_assentos_on_trip_id_and_numero", unique: true
    t.index ["trip_id"], name: "index_assentos_on_trip_id"
  end

  create_table "hotel_reservas", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "hotel_id", null: false
    t.string "codigo"
    t.string "hospede"
    t.string "tipo_quarto"
    t.date "check_in"
    t.date "check_out"
    t.integer "num_hospedes", default: 1
    t.integer "noites"
    t.decimal "valor", precision: 10, scale: 2, default: "0.0"
    t.string "status", default: "confirmada"
    t.string "motivo_cancelamento"
    t.datetime "cancelada_em"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["codigo"], name: "index_hotel_reservas_on_codigo", unique: true
    t.index ["hotel_id"], name: "index_hotel_reservas_on_hotel_id"
    t.index ["user_id"], name: "index_hotel_reservas_on_user_id"
  end

  create_table "hotels", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.string "city"
    t.string "address"
    t.integer "stars", default: 3
    t.decimal "price_per_night", precision: 10, scale: 2, default: "0.0"
    t.string "image_url"
    t.text "description"
    t.string "amenities"
    t.integer "total_rooms", default: 30
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "orders", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.decimal "total", precision: 10, scale: 2, default: "0.0"
    t.integer "user_id"
    t.string "status", default: "pendente"
    t.string "emailCliente"
    t.string "address"
    t.text "cart"
    t.string "delivery"
    t.string "payment"
    t.text "url_pagamento"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reservas", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "trip_id", null: false
    t.string "codigo"
    t.string "passageiro"
    t.string "documento"
    t.string "email"
    t.decimal "valor", precision: 10, scale: 2, default: "0.0"
    t.string "status", default: "confirmada"
    t.string "motivo_cancelamento"
    t.datetime "cancelada_em"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "nascimento"
    t.string "telefone"
    t.string "url_pagamento"
    t.string "preference_id"
    t.index ["codigo"], name: "index_reservas_on_codigo", unique: true
    t.index ["trip_id"], name: "index_reservas_on_trip_id"
    t.index ["user_id"], name: "index_reservas_on_user_id"
  end

  create_table "trips", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.string "bus_company"
    t.string "origin"
    t.string "destination"
    t.datetime "departure_time"
    t.decimal "price", precision: 10
    t.integer "seats_available"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "bus_company_logo"
    t.datetime "arrival_time"
    t.integer "total_seats", default: 44
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_general_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "cpf"
    t.string "reset_password_token"
    t.datetime "reset_password_expires_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "assentos", "reservas"
  add_foreign_key "assentos", "trips"
  add_foreign_key "hotel_reservas", "hotels"
  add_foreign_key "hotel_reservas", "users"
  add_foreign_key "reservas", "trips"
  add_foreign_key "reservas", "users"
end
