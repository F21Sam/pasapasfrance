const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { z }   = require('zod')
const prisma  = require('../utils/prisma')

// ── Schémas de validation Zod ──
const registerSchema = z.object({
  prenom:   z.string().min(1, 'Le prénom est requis'),
  email:    z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
  langue:   z.string().optional(),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

// ── Helpers tokens ──
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
  return { accessToken, refreshToken }
}

// ── POST /auth/register ──
const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    // Vérifier si email déjà utilisé
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        prenom:   data.prenom,
        email:    data.email,
        password: hashedPassword,
        langue:   data.langue || 'fr',
      },
      select: { id: true, prenom: true, email: true, langue: true, createdAt: true }
    })

    const tokens = generateTokens(user.id)

    res.status(201).json({ user, ...tokens })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── POST /auth/login ──
const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })
    }

    const tokens = generateTokens(user.id)

    res.json({
      user: { id: user.id, prenom: user.prenom, email: user.email, langue: user.langue },
      ...tokens
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── POST /auth/refresh ──
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token manquant.' })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const tokens  = generateTokens(decoded.userId)

    res.json(tokens)
  } catch (err) {
    res.status(401).json({ error: 'Refresh token invalide ou expiré.' })
  }
}

module.exports = { register, login, refresh }
