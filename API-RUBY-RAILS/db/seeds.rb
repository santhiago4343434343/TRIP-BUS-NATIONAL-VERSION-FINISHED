# ============================================================
# Seed do Trip Bus National
# Rode com:  docker compose exec api bundle exec rails db:seed
# (idempotente: pode rodar várias vezes sem duplicar)
# ============================================================

puts "🌱 Semeando banco de dados..."

# ─── Usuário demo (para testar login / histórico / cancelamento) ───
demo = User.find_or_initialize_by(email: "demo@tripbus.com")
if demo.new_record?
  demo.name = "Passageiro Demo"
  demo.password = "123456"
  demo.cpf = "000.000.000-00"
  demo.save!
  puts "👤 Usuário demo criado -> login: demo@tripbus.com / senha: 123456"
else
  puts "👤 Usuário demo já existe (demo@tripbus.com)."
end

# ─── Viagens / Empresas ───────────────────────────────────────────
# logo aponta para um arquivo REAL já existente em src/assets.
agora = Time.current

viagens = [
  { empresa: "Viação Cometa",       origem: "São Paulo",      destino: "Rio de Janeiro", preco: 120.00, partida: agora + 1.day + 8.hours,  duracao: 6.hours, logo: "assets/Logotipo_Cometa004.png" },
  { empresa: "Gontijo",             origem: "São Paulo",      destino: "Belo Horizonte", preco: 145.00, partida: agora + 1.day + 22.hours, duracao: 8.hours, logo: "assets/banner-gontijo.jpg" },
  { empresa: "Catarinense",         origem: "Florianópolis",  destino: "Curitiba",       preco: 89.90,  partida: agora + 2.days + 7.hours, duracao: 5.hours, logo: "assets/catarinense.png" },
  { empresa: "Eucatur",             origem: "Cascavel",       destino: "Curitiba",       preco: 130.00, partida: agora + 2.days + 20.hours, duracao: 9.hours, logo: "assets/eucatur-logo.jpg" },
  { empresa: "Guerino Seiscentos",  origem: "São Paulo",      destino: "Santos",         preco: 45.00,  partida: agora + 3.days + 6.hours, duracao: 2.hours, logo: "assets/guerinoseissento004.jpg" },
  { empresa: "Princesa dos Campos", origem: "Curitiba",       destino: "Ponta Grossa",   preco: 60.00,  partida: agora + 3.days + 13.hours, duracao: 3.hours, logo: "assets/princesa-dos-campos.png" },
  { empresa: "Vallesul",            origem: "Rio de Janeiro", destino: "Volta Redonda",  preco: 55.00,  partida: agora + 4.days + 7.hours, duracao: 3.hours, logo: "assets/vallesul.png" },
  { empresa: "Passaro Marrom",      origem: "São Paulo",      destino: "Campos do Jordão", preco: 70.00, partida: agora + 4.days + 21.hours, duracao: 4.hours, logo: "assets/passaro-marrom001.jpg" }
]

nomes_atuais = viagens.map { |v| v[:empresa] }
# Remove empresas antigas que não têm logo (limpeza das viagens de seeds anteriores).
Trip.where.not(bus_company: nomes_atuais).destroy_all

viagens.each do |v|
  trip = Trip.find_or_initialize_by(
    bus_company: v[:empresa],
    origin: v[:origem],
    destination: v[:destino]
  )

  trip.assign_attributes(
    bus_company_logo: v[:logo],
    departure_time: v[:partida],
    arrival_time: v[:partida] + v[:duracao],
    price: v[:preco],
    total_seats: 44
  )
  trip.seats_available ||= 44
  trip.save!
end

puts "🚌 #{Trip.count} viagens disponíveis no banco."

# ─── Hotéis ───────────────────────────────────────────────────────
# foto aponta para um arquivo REAL já existente em src/assets.
hoteis = [
  { nome: "Samba Hotéis Belo Horizonte", cidade: "Belo Horizonte", estrelas: 3, diaria: 250.00, foto: "assets/SAMBAHOTEIS.JPG",    comodidades: "Wi-Fi, Café da manhã, Estacionamento" },
  { nome: "Angra Inn",               cidade: "Angra dos Reis", estrelas: 4, diaria: 340.00, foto: "assets/angrainn-hotel.jpg",        comodidades: "Wi-Fi, Piscina, Café da manhã, Vista para o mar" },
  { nome: "Hotel Paulista Prime",    cidade: "São Paulo",      estrelas: 4, diaria: 320.00, foto: "assets/intercontinental.avif",     comodidades: "Wi-Fi, Café da manhã, Academia, Estacionamento" },
  { nome: "Copacabana Mar Hotel",    cidade: "Rio de Janeiro", estrelas: 5, diaria: 480.00, foto: "assets/marsol-beach-resort.jpg",   comodidades: "Wi-Fi, Piscina, Café da manhã, Vista para o mar" },
  { nome: "Minas Garden Hotel",      cidade: "Belo Horizonte", estrelas: 4, diaria: 280.00, foto: "assets/tangara.jpg",               comodidades: "Wi-Fi, Café da manhã, Restaurante" },
  { nome: "Praia do Futuro Resort",  cidade: "Fortaleza",      estrelas: 5, diaria: 390.00, foto: "assets/capcana.webp",              comodidades: "Wi-Fi, Piscina, Praia privativa, Café da manhã" },
  { nome: "Recife Boa Viagem Hotel", cidade: "Recife",         estrelas: 4, diaria: 300.00, foto: "assets/park-hotel-recife.webp",    comodidades: "Wi-Fi, Piscina, Café da manhã" },
  { nome: "Vitória Bay Hotel",       cidade: "Vitória",        estrelas: 3, diaria: 220.00, foto: "assets/hotel-bahia.webp",          comodidades: "Wi-Fi, Café da manhã, Estacionamento" },
  { nome: "Floripa Ilha Hotel",      cidade: "Florianópolis",  estrelas: 4, diaria: 350.00, foto: "assets/laguna-hotel-paraiba.webp", comodidades: "Wi-Fi, Piscina, Café da manhã" },
  { nome: "Curitiba Central Hotel",  cidade: "Curitiba",       estrelas: 3, diaria: 240.00, foto: "assets/wish-natal.jpg",            comodidades: "Wi-Fi, Café da manhã, Academia" }
]

hoteis.each do |h|
  hotel = Hotel.find_or_initialize_by(name: h[:nome])
  hotel.assign_attributes(
    city: h[:cidade],
    stars: h[:estrelas],
    price_per_night: h[:diaria],
    image_url: h[:foto],
    amenities: h[:comodidades],
    total_rooms: 40,
    description: "#{h[:nome]} — conforto e ótima localização em #{h[:cidade]}."
  )
  hotel.save!
end

puts "🏨 #{Hotel.count} hotéis disponíveis no banco."
puts "✅ Seed concluído!"
