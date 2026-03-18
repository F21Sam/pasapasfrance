const jwt = require('jsonwebtoken')

// ── Vérifie le token JWT sur chaque route protégée ──
const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou invalide.' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.userId
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' })
    }
    return res.status(401).json({ error: 'Token invalide.' })
  }
}

module.exports = authMiddleware
