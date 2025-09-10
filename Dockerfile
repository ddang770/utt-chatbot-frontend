# frontend/Dockerfile
FROM node:24.2.0 AS build

WORKDIR /app

# Copy và cài dependencies
COPY frontend/package*.json ./
RUN npm install -g serve && npm install

# Copy source code
COPY frontend/ ./
COPY .env .env

RUN npm run build

# Chạy serve để phục vụ build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
