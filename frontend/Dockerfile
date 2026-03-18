# ══════════════════════════════════════════════
# Dockerfile – Frontend PasàPasFrance
# React + Vite — Dev mode dans Docker
# ══════════════════════════════════════════════

FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Lancer Vite en mode dev avec host 0.0.0.0
# pour être accessible depuis l'extérieur du container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
