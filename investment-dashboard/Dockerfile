# --- Étape de Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copier les configurations de la racine
COPY package*.json ./
COPY tsconfig*.json ./

# 2. Copier l'intégralité des répertoires pour que tsc résolve les chemins sources (.ts)
COPY shared ./shared
COPY investment-dashboard ./investment-dashboard
COPY investments-app ./investments-app

# 3. Installer les dépendances du monorepo
RUN npm ci

# 4. Générer Prisma dans le contexte du workspace back-end
ENV DATABASE_URL="file:/app/data/dev.db"
RUN npm run prisma generate --workspace=investments-app

# 5. Compiler d'abord le projet shared, puis le front-end
RUN npm run build --workspace=@investments/shared
RUN npm run build --workspace=investment-dashboard

# --- Étape de Production (Nginx) ---
FROM nginx:alpine
COPY --from=builder /app/investment-dashboard/dist /usr/share/nginx/html
COPY investment-dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]