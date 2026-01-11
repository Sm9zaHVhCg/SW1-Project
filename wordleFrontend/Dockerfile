# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Angular build to Nginx html root
COPY --from=build /app/dist/wordleFrontend/browser/ /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the placeholder runtime config
COPY src/assets/config.runtime.json /usr/share/nginx/html/assets/config.runtime.json

# Inject environment variables into config at container startup
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/config.runtime.json > /usr/share/nginx/html/assets/config.generated.json && mv /usr/share/nginx/html/assets/config.generated.json /usr/share/nginx/html/assets/config.runtime.json && exec nginx -g 'daemon off;'"]

EXPOSE 80
