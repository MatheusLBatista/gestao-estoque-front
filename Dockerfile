FROM node:22

EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN cp .env.example .env

ENTRYPOINT ["npm", "run", "dev"]