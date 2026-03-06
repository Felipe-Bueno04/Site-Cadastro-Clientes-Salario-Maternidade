FROM node:20

WORKDIR /app

# copiar package.json
COPY package*.json ./

# instalar dependências
RUN npm install

# copiar prisma primeiro
COPY prisma ./prisma

# copiar .env
COPY .env .env

# gerar prisma client
RUN npx prisma generate

# copiar resto do projeto
COPY . .

# build do next
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]