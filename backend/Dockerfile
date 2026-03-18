# ══════════════════════════════════════════════
# Dockerfile – Backend PasàPasFrance
# Node.js 20 Alpine (léger)
# ══════════════════════════════════════════════

# ── Étape 1 : Build ──
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

# ── Étape 2 : Production ──
FROM node:20-alpine AS production

WORKDIR /app

# Copier depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Créer le dossier uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 3000

# Script de démarrage :
# 1. Appliquer les migrations Prisma
# 2. Lancer le serveur
CMD ["sh", "-c", "npx prisma db push && node src/index.js"]
