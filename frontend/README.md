# PasàPasFrance – Frontend

Application web d'accompagnement administratif pour nouveaux arrivants en France.

## Stack

- **React 18** + **Vite** (bundler ultra-rapide)
- **Tailwind CSS** (design system basé sur la charte graphique)
- **React Router v6** (routing SPA)
- **Lucide React** (icônes)

---

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir http://localhost:5173
```

---

## Structure du projet

```
src/
├── assets/              # Images statiques supplémentaires
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx       # Navigation principale (transparente sur landing)
│   │   └── AppLayout.jsx    # Layout sidebar pour pages authentifiées
│   ├── sections/
│   │   ├── HeroSection.jsx      # Hero landing avec card stack animée
│   │   └── LandingSections.jsx  # Marquee, Stats, Process, Profiles, Bento, CTA, Footer
│   └── ui/              # Composants UI réutilisables (à venir)
├── context/
│   └── AuthContext.jsx  # Gestion de l'authentification (mock → remplacer par JWT)
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── OnboardingPage.jsx   # Wizard 3 étapes de création de profil
│   ├── DashboardPage.jsx    # Tableau de bord principal
│   ├── DemarchesPage.jsx    # Liste des démarches avec filtres
│   ├── DemarcheDetail.jsx   # Détail + étapes cliquables
│   ├── DocumentsPage.jsx    # Upload et gestion des documents
│   ├── NotificationsPage.jsx
│   └── ProfilePage.jsx
├── utils/
│   └── mockData.js      # Données mock (démarches, notifications, profils)
├── App.jsx              # Router principal
├── main.jsx             # Point d'entrée
└── index.css            # Tailwind + composants globaux
public/
└── logo.png             # Logo PasàPasFrance
```

---

## Charte graphique (Tailwind tokens)

| Token               | Valeur     | Usage                          |
|---------------------|------------|--------------------------------|
| `navy`              | `#1A4B8C`  | Primaire – titres, boutons     |
| `navy-dark`         | `#0F2E57`  | Hero, sidebar dark             |
| `vivid`             | `#2196F3`  | Accent – CTA, barres, liens    |
| `pale`              | `#E8F0FE`  | Fonds secondaires, hover       |
| `success`           | `#2E7D32`  | Étapes validées                |
| `warning`           | `#F57C00`  | Alertes, urgences              |
| `app-bg`            | `#F5F7FA`  | Fond général                   |
| `font-serif`        | DM Serif Display | Titres éditoriaux        |
| `font-sans`         | DM Sans    | Corps de texte                 |

---

## Routes

| Route               | Page              | Accès       |
|---------------------|-------------------|-------------|
| `/`                 | Landing           | Public      |
| `/login`            | Connexion         | Public      |
| `/register`         | Inscription       | Public      |
| `/onboarding`       | Wizard profil     | Authentifié |
| `/app/dashboard`    | Tableau de bord   | Authentifié |
| `/app/demarches`    | Liste démarches   | Authentifié |
| `/app/demarches/:id`| Détail démarche   | Authentifié |
| `/app/documents`    | Documents         | Authentifié |
| `/app/notifications`| Notifications     | Authentifié |
| `/app/profil`       | Profil            | Authentifié |

---

## Connexion avec le backend

Remplacer le mock dans `src/context/AuthContext.jsx` :

```js
// Login réel
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
const data = await res.json()
// stocker data.accessToken + data.refreshToken
```

Variable d'environnement à créer dans `.env` :
```
VITE_API_URL=http://localhost:3000
```

---

## Build production

```bash
npm run build
# → dist/ prêt pour Vercel ou Netlify
```

Déploiement Vercel :
```bash
npx vercel --prod
```
