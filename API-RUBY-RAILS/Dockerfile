FROM ruby:3.2

# 1. Instala dependências do sistema
# Trocamos 'libpq-dev' (Postgres) por 'default-libmysqlclient-dev' (MariaDB/MySQL)
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    mariadb-client \
    nodejs \
    tzdata

# 2. Define o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copia os arquivos de dependências primeiro
# Isso otimiza o cache do Docker (não reinstala as gems se o Gemfile não mudar)
COPY Gemfile Gemfile.lock ./

# 4. Instala as gems do Rails
RUN bundle install

# 5. Copia o restante do código do projeto
COPY . .

# 6. Expõe a porta 3000 (porta padrão do Rails)
EXPOSE 3000

# 7. Comando de inicialização
# - Remove o server.pid (evita erro de 'servidor já rodando')
# - Inicia o servidor ouvindo em 0.0.0.0 (essencial para o Docker)
CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails s -b 0.0.0.0"]