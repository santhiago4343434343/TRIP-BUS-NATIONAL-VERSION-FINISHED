# Estágio de Desenvolvimento
FROM node:20-slim

# 1. Instala dependências de build (necessárias para SASS e pacotes nativos)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Ajuste de Permissões ANTES de copiar (Crucial para evitar EACCES)
# Criamos a pasta e damos a posse ao usuário 'node' que já vem na imagem
RUN chown -R node:node /app

# 3. Copia arquivos de dependências como root para instalar, depois muda o dono
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node tailwind.config.js ./
COPY --chown=node:node postcss.config.js ./

# 4. Muda para o usuário 'node' (Segurança e Permissão)
USER node

# 5. Instala as dependências (agora como usuário node)
# Usamos --legacy-peer-deps caso haja conflitos de versão no Angular 20
RUN npm install --quiet

# 6. Copia o restante do código com as permissões certas
COPY --chown=node:node . .

# Expõe a porta padrão
EXPOSE 4200

# Limite de memória do Node NO LUGAR CERTO: o Node lê NODE_OPTIONS sozinho.
# Antes isso ia como flag do npx (que não entende), e o npx acabava rodando um
# 'ng' avulso FORA do workspace -> daí o "outside a workspace" repetido.
ENV NODE_OPTIONS=--max-old-space-size=2048

# 7. Comando limpo: o npx acha o 'ng' LOCAL (em /app/node_modules) e serve o Angular.
# (removi o --disable-host-check: o builder novo @angular/build já ignora essa flag)
CMD ["npx", "ng", "serve", \
    "--host", "0.0.0.0", \
    "--port", "4200", \
    "--proxy-config", "proxy.conf.json", \
    "--poll", "2000"]