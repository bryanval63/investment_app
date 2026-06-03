# --- Étape de Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de configuration globaux ou partagés si nécessaires
# (Adapte si tu as un package.json à la racine du monorepo, sinon on copie le nécessaire)
COPY shared ./shared
COPY investments-app ./investments-app

# Installation et build du package partagé d'abord
WORKDIR /app/shared
RUN npm ci && npm run build --if-present

# Installation et build du backend
WORKDIR /app/investments-app
RUN npm ci
RUN npx prisma generate
RUN npm run build

# --- Étape de Production ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/investments-app/package*.json ./
RUN npm ci --only=production

# Récupération des builds et de Prisma
COPY --from=builder /app/investments-app/dist ./dist
COPY --from=builder /app/investments-app/prisma ./prisma
COPY --from=builder /app/investments-app/node_modules/.prisma ./node_modules/.prisma

# Récupération du dossier shared compilé (indispensable si ton backend l'importe au runtime)
COPY --from=builder /app/shared ../shared

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]