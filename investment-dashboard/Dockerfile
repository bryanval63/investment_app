# --- Étape de Build ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY shared ./shared
COPY investment-dashboard ./investment-dashboard

# Build du shared au cas où le front en dépend
WORKDIR /app/shared
RUN npm ci && npm run build --if-present

# Build du front
WORKDIR /app/investment-dashboard
RUN npm ci
RUN npm run build

# --- Étape de Production (Nginx) ---
FROM nginx:alpine
COPY --from=builder /app/investment-dashboard/dist /usr/share/nginx/html
COPY investment-dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]