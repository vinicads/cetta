FROM node:18.17

WORKDIR /app

# Copie os arquivos necessários
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copie o restante do código-fonte
COPY . .


CMD npm run dev

EXPOSE 5173