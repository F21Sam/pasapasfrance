require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const path    = require('path')
const routes  = require('./routes')

const app = require('./app')
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// ── Middlewares globaux ──────────────────────────────
app.use(helmet())
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Fichiers uploadés (statiques) ───────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ── Routes API ──────────────────────────────────────
app.use('/api', routes)

// ── Health check ────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', app: 'PasàPasFrance API', timestamp: new Date() })
})

// ── 404 ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable.` })
})

// ── Erreurs globales ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo).' })
  }
  res.status(500).json({ error: err.message || 'Erreur serveur.' })
})

// ── Démarrage ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ✅ PasàPasFrance API démarrée
  📡 Port     : ${PORT}
  🌍 Env      : ${process.env.NODE_ENV}
  🔗 Frontend : ${process.env.FRONTEND_URL}
  `)
})
