# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (cache-friendly)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build for Docker target
COPY . .
RUN npm run build -- --configuration=docker

# ── Serve stage ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config with API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to Nginx html directory
COPY --from=build /app/dist/skin-vision/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
