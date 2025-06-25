# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Production stage - NGINX pour servir l'app Angular
FROM nginx:stable-alpine
COPY --from=build /app/dist/nom-du-projet-angular/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
