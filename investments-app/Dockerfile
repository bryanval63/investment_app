# --- Étape de Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copier les configurations de la racine
COPY package*.json ./
COPY tsconfig*.json ./

# 2. Copier l'intégralité du code pour les liaisons inter-workspaces
COPY shared ./shared
COPY investments-app ./investments-app

# 3. Installer les dépendances du monorepo
RUN npm ci

# 4. Générer Prisma dans le contexte du back-end
RUN npm run prisma generate --workspace=investments-app

# 5. Compiler le shared puis le back-end
RUN npm run build --workspace=@investments/shared
RUN npm run build --workspace=investments-app

# --- Étape de Production ---
FROM node:20-alpine
WORKDIR /app

# Récupérer les fichiers de dépendances requis pour la production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/investments-app/package.json ./investments-app/package.json
COPY --from=builder /app/investments-app/prisma.config.ts ./investments-app/prisma.config.ts

# Installer uniquement les dépendances de production pour le back
ENV DATABASE_URL="file:./dev.db"
RUN npm ci --only=production --workspace=investments-app

# Récupérer les builds et artefacts générés
COPY --from=builder /app/investments-app/dist ./investments-app/dist
COPY --from=builder /app/investments-app/prisma ./investments-app/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared ./shared

EXPOSE 3000

CMD ["sh", "-c", "DATABASE_URL=file:/app/data/dev.db npx prisma migrate deploy --schema=./investments-app/prisma/schema.prisma --config=./investments-app/prisma.config.ts && node investments-app/dist/main"]