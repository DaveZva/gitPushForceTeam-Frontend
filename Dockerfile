# Multi-stage build

# Stage 1: Build aplikace
FROM node:20-alpine AS build
WORKDIR /app

# Zkopírovat package files a nainstalovat dependencies (cache layer)
COPY package*.json ./
RUN npm ci

# Zkopírovat zdrojový kód a buildovat
COPY . .
RUN npm run build

# Stage 2: Production server (nginx)
FROM nginx:alpine

# Zkopírovat build z předchozího stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config pro React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponovat port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]