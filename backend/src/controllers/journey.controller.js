const prisma = require('../utils/prisma')

// ── POST /journeys/generate ──
// Génère le parcours personnalisé selon le profil de l'utilisateur
const generate = async (req, res) => {
  try {
    // 1. Récupérer le profil de l'utilisateur
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId }
    })
    if (!profile) {
      return res.status(400).json({ error: 'Profil incomplet. Veuillez compléter l\'onboarding.' })
    }

    // 2. Récupérer toutes les démarches correspondant au profil
    const steps = await prisma.step.findMany({
      where: {
        actif:   true,
        profils: { has: profile.statut }
      },
      include: {
        etapes:      { orderBy: { ordre: 'asc' } },
        dependances: { include: { requit: true } }
      }
    })

    // 3. Supprimer l'ancien parcours s'il existe
    await prisma.journey.deleteMany({ where: { userId: req.userId } })
    await prisma.stepProgression.deleteMany({ where: { userId: req.userId } })

    // 4. Créer le nouveau parcours
    const journey = await prisma.journey.create({
      data: { userId: req.userId, progression: 0 }
    })

    // 5. Pour chaque démarche : calculer les dépendances et créer la progression
    const progressions = []
    for (const step of steps) {
      // Vérifier si les dépendances sont satisfaites
      const depsSatisfaites = step.dependances.every(dep => {
        // Pour un nouveau parcours, aucune dépendance n'est satisfaite
        return false
      })

      const statut = step.dependances.length === 0 ? 'A_FAIRE' : 'BLOQUE'

      const progression = await prisma.stepProgression.create({
        data: {
          userId: req.userId,
          stepId: step.id,
          statut,
        }
      })

      // Créer la progression pour chaque étape
      for (const etape of step.etapes) {
        await prisma.etapeProgression.create({
          data: {
            etapeId:          etape.id,
            stepProgressionId: progression.id,
            statut:           'A_FAIRE',
          }
        })
      }

      progressions.push({ ...step, statut })
    }

    // 6. Notification
    await prisma.notification.create({
      data: {
        userId:  req.userId,
        message: `Votre parcours a été généré avec ${steps.length} démarches personnalisées.`,
        type:    'INFO',
      }
    })

    res.status(201).json({
      journey,
      demarches: progressions.map(s => ({
        id:          s.id,
        titre:       s.titre,
        priorite:    s.priorite,
        statut:      s.statut,
        organisme:   s.organisme,
        delai:       s.delai,
        dependances: s.dependances.map(d => d.requitId),
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── GET /journeys ──
const getJourney = async (req, res) => {
  try {
    const progressions = await prisma.stepProgression.findMany({
      where:   { userId: req.userId },
      include: {
        step: {
          include: {
            etapes:      { orderBy: { ordre: 'asc' } },
            dependances: true,
          }
        },
        etapeProgressions: { include: { etape: true } }
      }
    })

    const journey = await prisma.journey.findUnique({
      where: { userId: req.userId }
    })

    res.json({ journey, demarches: progressions })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

module.exports = { generate, getJourney }
