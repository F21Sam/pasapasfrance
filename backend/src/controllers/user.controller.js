const { z }  = require('zod')
const prisma = require('../utils/prisma')

const profileSchema = z.object({
  prenom:      z.string().min(1).optional(),
  langue:      z.string().optional(),
  statut:      z.enum(['ETUDIANT','SALARIE','AU_PAIR','RESIDENT','PROFESSIONNEL']).optional(),
  nationalite: z.string().optional(),
  dateArrivee: z.string().optional(),
  logement:    z.enum(['HEBERGE','LOCATAIRE','PROPRIETAIRE']).optional(),
  banque:      z.enum(['COMPTE_FR','COMPTE_ETRANGER','AUCUN']).optional(),
})

// ── GET /users/me ──
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.userId },
      select: {
        id: true, prenom: true, email: true, langue: true, createdAt: true,  role: true, 
        profile: true,
        journey: { select: { id: true, progression: true } },
      }
    })
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── PUT /users/me ──
const updateMe = async (req, res) => {
  try {
    const data = profileSchema.parse(req.body)

    // Mettre à jour l'utilisateur
    const updateUser = {}
    if (data.prenom) updateUser.prenom = data.prenom
    if (data.langue) updateUser.langue = data.langue

    const user = await prisma.user.update({
      where:  { id: req.userId },
      data:   updateUser,
      select: { id: true, prenom: true, email: true, langue: true }
    })

    // Mettre à jour ou créer le profil
    if (data.statut || data.nationalite || data.dateArrivee || data.logement || data.banque) {
      const profileData = {}
      if (data.statut)      profileData.statut      = data.statut
      if (data.nationalite) profileData.nationalite = data.nationalite
      if (data.dateArrivee && data.dateArrivee !== '') {
      const date = new Date(data.dateArrivee)
      if (!isNaN(date.getTime())) profileData.dateArrivee = date
      }
      if (data.logement)    profileData.logement    = data.logement
      if (data.banque)      profileData.banque      = data.banque

    await prisma.profile.upsert({
      where:  { userId: req.userId },
      update: profileData,
      create: {
        userId:      req.userId,
        statut:      profileData.statut      ?? 'ETUDIANT',
        nationalite: profileData.nationalite ?? '',
        dateArrivee: profileData.dateArrivee ?? new Date(),
        logement:    profileData.logement    ?? 'HEBERGE',
        banque:      profileData.banque      ?? 'AUCUN',
        ...profileData,
      }
    })
    }

    // Notification de confirmation
    await prisma.notification.create({
      data: {
        userId:  req.userId,
        message: 'Votre profil a été mis à jour avec succès.',
        type:    'INFO',
      }
    })

    res.json({ message: 'Profil mis à jour.', user })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── DELETE /users/me ── (RGPD)
const deleteMe = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } })
    res.json({ message: 'Compte supprimé.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

module.exports = { getMe, updateMe, deleteMe }
