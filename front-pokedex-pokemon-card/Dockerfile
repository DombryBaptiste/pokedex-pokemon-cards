# Étape 1 : build Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Étape 2 : serveur NGINX
FROM nginx:alpine
COPY --from=build /app/dist/front-pokedex-pokemon-card /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
