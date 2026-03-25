<div align="center">
  <img src="frontend/public/logo.png" alt="PasàPasFrance" height="80" />
  
  # PasàPasFrance
  
  **Assistant de parcours administratif pour nouveaux arrivants en France**
  
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
  [![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
  [![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
  [![License](https://img.shields.io/badge/Licence-MIT-green)](LICENSE)

  [Démo live](https://pasapasfrance.vercel.app) · [Rapport](docs/rapport_final.pdf) · [Nous contacter](https://pasapasfrance.vercel.app/nous-contacter)
</div>

---

## Présentation

PasàPasFrance est une application web académique conçue pour accompagner les nouveaux arrivants en France dans leurs démarches administratives. Elle génère un **parcours personnalisé et ordonné** selon le profil de l'utilisateur, avec suivi d'avancement, gestion des documents et rappels automatisés.

### Problématique

Les nouveaux arrivants font face à des dizaines de démarches dispersées sur autant de sites officiels (OFII, CPAM, CAF, banque, préfecture...). L'absence de visibilité sur l'ordre logique, les délais et les documents requis rend cette expérience particulièrement stressante — notamment pour les personnes non francophones.

### Solution

- Parcours administratif **généré automatiquement** selon le profil (statut, nationalité, logement, banque)
- Démarches **ordonnées par priorité** avec gestion des dépendances
- Suivi d'avancement **en temps réel** avec validation d'étapes
- Gestion centralisée des **documents requis** avec upload et prévisualisation
- **Rappels automatiques** par email via n8n
- Interface **bilingue FR/EN** avec mode clair/sombre

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | React.js + Vite + Tailwind CSS | React 18, Vite 5 |
| Backend | Node.js + Express | Node 20+ |
| ORM | Prisma | 5.x |
| Base de données | PostgreSQL | 15+ |
| Auth | JWT (HS256) | Access 1h + Refresh 7j |
| i18n | i18next + react-i18next | 25+ |
| Upload | Multer | — |
| Automatisation | n8n | Latest |
| Conteneurisation | Docker + docker-compose | — |
| Déploiement | Vercel + Render | — |

---

## Prérequis

- [Node.js](https://nodejs.org) >= 20
- [Docker](https://docker.com) + Docker Compose
- [Git](https://git-scm.com)

---

## Installation & lancement

### 1. Cloner le projet

```bash
git clone https://github.com/F21Sam/pasapasfrance.git
cd pasapasfrance
```

### 2. Variables d'environnement

**Backend** — copie et remplis le fichier :
```bash
cp backend/.env.example backend/.env
```

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/pasapasfrance_db

# JWT
JWT_SECRET=votre_secret_jwt_32_chars_minimum
JWT_REFRESH_SECRET=votre_refresh_secret_different
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# n8n (optionnel)
N8N_API_SECRET=votre_secret_n8n

# Email SMTP (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe_app
```

**Frontend** — crée le fichier :
```bash
echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env
```

### 3. Lancement avec Docker (recommandé)

```bash
# Démarrer tous les services (postgres + backend + frontend + n8n)
docker-compose up -d

# Vérifier que tout tourne
docker-compose ps
```

L'application est disponible sur :
- Frontend → http://localhost:5173
- Backend API → http://localhost:3000
- n8n → http://localhost:5678

### 4. Lancement sans Docker

**Backend :**
```bash
cd backend
npm install

# Appliquer le schéma Prisma
npx prisma db push

# Peupler la base de données
npx prisma db seed

# Démarrer le serveur
npm run dev
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

---

## Structure du projet

```
pasapasfrance/
├── frontend/                    # Application React + Vite
│   ├── public/                  # Assets statiques (logo, favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar.jsx, AppLayout.jsx
│   │   │   └── sections/        # HeroSection.jsx, LandingSections.jsx
│   │   ├── context/             # AuthContext.jsx, ThemeContext.jsx
│   │   ├── i18n/                # index.js + locales/fr.json + en.json
│   │   ├── pages/               # 12 pages (Dashboard, Démarches, Documents...)
│   │   ├── services/            # api.js (Axios + intercepteurs JWT)
│   │   └── utils/               # mockData.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # API Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma        # 10 modèles + 7 enums
│   │   └── seed.js              # Données initiales
│   └── src/
│       ├── controllers/         # auth, user, journey, step, document, notification
│       ├── middlewares/         # auth.middleware.js (JWT)
│       └── routes/              # index.js
│
├── docker-compose.yml           # Dev local (4 services)
├── docker-compose.prod.yml      # Production
└── .github/workflows/           # CI/CD GitHub Actions
```

---

## API REST

| Route | Méthode | Auth | Description |
|-------|---------|------|-------------|
| `/auth/register` | POST | Non | Inscription |
| `/auth/login` | POST | Non | Connexion + tokens JWT |
| `/auth/refresh` | POST | Non | Renouveler l'access token |
| `/users/me` | GET, PUT | JWT | Profil utilisateur |
| `/journeys/generate` | POST | JWT | Générer le parcours |
| `/journeys` | GET | JWT | Récupérer le parcours |
| `/steps` | GET | JWT | Liste des démarches (`?search=`) |
| `/steps/:id` | GET | JWT | Détail d'une démarche |
| `/steps/:id/status` | PUT | JWT | Valider une étape |
| `/documents` | GET, POST | JWT | Documents + upload |
| `/documents/:id` | DELETE | JWT | Supprimer un document |
| `/notifications` | GET | JWT | Liste des notifications |
| `/notifications/:id/read` | PUT | JWT | Marquer comme lue |
| `/notifications/read-all` | PUT | JWT | Tout marquer comme lu |

---

## Déploiement

### Frontend — Vercel

1. Connecte ton repo GitHub sur [vercel.com](https://vercel.com)
2. Configure :
   - **Root Directory** → `frontend`
   - **Framework** → Vite
   - **Build Command** → `npm run build`
   - **Output Directory** → `dist`
3. Ajoute la variable d'environnement :
   ```
   VITE_API_URL = https://ton-backend.onrender.com/api
   ```
4. Deploy !

### Backend — Render

1. Crée un **Web Service** sur [render.com](https://render.com)
2. Configure :
   - **Root Directory** → `backend`
   - **Build Command** → `npm install && npx prisma generate && npx prisma db push`
   - **Start Command** → `npm start`
3. Ajoute toutes les variables d'environnement (voir section Variables)
4. Deploy !

### Base de données — Render PostgreSQL

1. Crée une **PostgreSQL** database sur Render
2. Copie l'**Internal Database URL** dans `DATABASE_URL` du backend

---

## Fonctionnalités

| Fonctionnalité | Statut |
|----------------|--------|
| Authentification JWT (register/login/refresh) | ✅ |
| Onboarding wizard 3 étapes | ✅ |
| Génération de parcours personnalisé | ✅ |
| Suivi démarches + validation étapes | ✅ |
| Upload documents (PDF/JPG/PNG) | ✅ |
| Prévisualisation documents | ✅ |
| Notifications in-app | ✅ |
| Tableau de bord avec progression | ✅ |
| Recherche par mots-clés | ✅ |
| Interface bilingue FR/EN | ✅ |
| Mode clair / sombre | ✅ |
| Rappels email automatiques (n8n) | 🔄 En cours |
| Page administration | 🔄 En cours |
| Tests Jest > 60% | 🔄 Planifié |

---

## Scripts disponibles

```bash
# Frontend
npm run dev        # Démarrer en développement
npm run build      # Build production
npm run preview    # Prévisualiser le build
npm run lint       # Linter ESLint

# Backend
npm run dev        # Démarrer avec nodemon
npm start          # Démarrer en production
npx prisma studio  # Interface graphique BDD
npx prisma db push # Appliquer le schéma
npx prisma db seed # Peupler la base

# Docker
docker-compose up -d        # Démarrer tous les services
docker-compose down         # Arrêter tous les services
docker-compose logs -f      # Voir les logs en temps réel
```

---

## Équipe

| Membre | Rôle |
|--------|------|
| **Fanta Samassa** | Référente Frontend — React, Tailwind, i18n, dark mode |
| **Ekshade Kakpo** | Référent UML & Conception — Diagrammes, CDC, rapport |

Projet académique — Module UML & Développement Fullstack · ESGI Paris · 2025-2026

---
