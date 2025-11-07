FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN rm -rf ./build

RUN npm run build
