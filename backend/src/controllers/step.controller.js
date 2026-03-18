const prisma = require('../utils/prisma')

// ── GET /steps ── (avec recherche par mots-clés)
const getSteps = async (req, res) => {
  try {
    const { search, statut, priorite } = req.query

    const where = { userId: req.userId }
    if (statut)   where.statut   = statut
    if (priorite) where.step     = { priorite }

    // Recherche par mots-clés dans titre ou description
    const stepWhere = {}
    if (search) {
      stepWhere.OR = [
        { titre:       { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organisme:   { contains: search, mode: 'insensitive' } },
      ]
    }
    if (priorite) stepWhere.priorite = priorite

    const progressions = await prisma.stepProgression.findMany({
      where: {
        userId: req.userId,
        ...(statut ? { statut } : {}),
        step: Object.keys(stepWhere).length > 0 ? stepWhere : undefined,
      },
      include: {
        step: {
          include: {
            etapes:      { orderBy: { ordre: 'asc' } },
            dependances: true,
          }
        },
        etapeProgressions: true,
      },
      orderBy: { step: { priorite: 'asc' } }
    })

    // Formater la réponse
    const demarches = progressions.map(p => ({
      id:          p.step.id,
      titre:       p.step.titre,
      description: p.step.description,
      organisme:   p.step.organisme,
      delai:       p.step.delai,
      lienOfficiel:p.step.lienOfficiel,
      priorite:    p.step.priorite,
      statut:      p.statut,
      progression: calculerProgression(p.etapeProgressions),
      dependances: p.step.dependances.map(d => d.requitId),
      etapes:      p.step.etapes.map((e, i) => ({
        id:     e.id,
        nom:    e.nom,
        ordre:  e.ordre,
        statut: p.etapeProgressions[i]?.statut ?? 'A_FAIRE',
      }))
    }))

    res.json(demarches)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── GET /steps/:id ──
const getStep = async (req, res) => {
  try {
    const stepId = parseInt(req.params.id)

    const progression = await prisma.stepProgression.findUnique({
      where: { userId_stepId: { userId: req.userId, stepId } },
      include: {
        step: {
          include: {
            etapes:      { orderBy: { ordre: 'asc' } },
            dependances: { include: { requit: true } },
            documents:   true,
          }
        },
        etapeProgressions: { include: { etape: true } }
      }
    })

    if (!progression) {
      return res.status(404).json({ error: 'Démarche introuvable.' })
    }

    res.json({
      id:          progression.step.id,
      titre:       progression.step.titre,
      description: progression.step.description,
      organisme:   progression.step.organisme,
      delai:       progression.step.delai,
      lienOfficiel:progression.step.lienOfficiel,
      priorite:    progression.step.priorite,
      statut:      progression.statut,
      progression: calculerProgression(progression.etapeProgressions),
      dependances: progression.step.dependances.map(d => ({
        id:    d.requit.id,
        titre: d.requit.titre,
      })),
      etapes: progression.step.etapes.map(e => {
        const ep = progression.etapeProgressions.find(ep => ep.etapeId === e.id)
        return { id: e.id, nom: e.nom, ordre: e.ordre, statut: ep?.statut ?? 'A_FAIRE' }
      })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── PUT /steps/:id/status ── (valider une étape)
const updateStepStatus = async (req, res) => {
  try {
    const stepId  = parseInt(req.params.id)
    const { etapeId, statut } = req.body

    if (!etapeId || !statut) {
      return res.status(400).json({ error: 'etapeId et statut requis.' })
    }

    // Récupérer la progression de la démarche
    const stepProgression = await prisma.stepProgression.findUnique({
      where:   { userId_stepId: { userId: req.userId, stepId } },
      include: { etapeProgressions: true }
    })
    if (!stepProgression) {
      return res.status(404).json({ error: 'Démarche introuvable.' })
    }

    // Mettre à jour le statut de l'étape
    await prisma.etapeProgression.updateMany({
      where: {
        etapeId,
        stepProgressionId: stepProgression.id,
      },
      data: { statut }
    })

    // Recalculer le statut global de la démarche
    const etapesUpdated = await prisma.etapeProgression.findMany({
      where: { stepProgressionId: stepProgression.id }
    })

    const pct = calculerProgression(etapesUpdated)
    let nouveauStatut = stepProgression.statut

    if (pct === 100)      nouveauStatut = 'TERMINE'
    else if (pct > 0)     nouveauStatut = 'EN_COURS'

    await prisma.stepProgression.update({
      where: { id: stepProgression.id },
      data:  { statut: nouveauStatut }
    })

    // Débloquer les démarches dépendantes si terminée
    if (nouveauStatut === 'TERMINE') {
      await debloquerDependances(req.userId, stepId)
    }

    // Recalculer la progression globale du parcours
    await recalculerJourney(req.userId)

    const journey = await prisma.journey.findUnique({ where: { userId: req.userId } })

    res.json({ message: 'Étape mise à jour.', progression: pct, journeyProgression: journey?.progression ?? 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── Helpers ──
function calculerProgression(etapeProgressions) {
  if (!etapeProgressions || etapeProgressions.length === 0) return 0
  const terminees = etapeProgressions.filter(e => e.statut === 'TERMINE').length
  return Math.round((terminees / etapeProgressions.length) * 100)
}

async function debloquerDependances(userId, stepIdTermine) {
  // Trouver les démarches qui dépendent de celle qui vient d'être terminée
  const dependantes = await prisma.stepDependance.findMany({
    where: { requitId: stepIdTermine }
  })

  for (const dep of dependantes) {
    // Vérifier si TOUTES les dépendances de cette démarche sont satisfaites
    const toutesLesDeps = await prisma.stepDependance.findMany({
      where: { stepId: dep.stepId }
    })

    const toutesTerminees = await Promise.all(
      toutesLesDeps.map(async d => {
        const prog = await prisma.stepProgression.findUnique({
          where: { userId_stepId: { userId, stepId: d.requitId } }
        })
        return prog?.statut === 'TERMINE'
      })
    )

    if (toutesTerminees.every(Boolean)) {
      await prisma.stepProgression.updateMany({
        where: { userId, stepId: dep.stepId, statut: 'BLOQUE' },
        data:  { statut: 'A_FAIRE' }
      })

      // Notifier l'utilisateur
      const step = await prisma.step.findUnique({ where: { id: dep.stepId } })
      await prisma.notification.create({
        data: {
          userId,
          message: `Nouvelle démarche débloquée : ${step?.titre}`,
          type:    'INFO',
        }
      })
    }
  }
}

async function recalculerJourney(userId) {
  const progressions = await prisma.stepProgression.findMany({ where: { userId } })
  const terminees    = progressions.filter(p => p.statut === 'TERMINE').length
  const pct          = Math.round((terminees / progressions.length) * 100)

  await prisma.journey.update({
    where: { userId },
    data:  { progression: pct }
  })
}

module.exports = { getSteps, getStep, updateStepStatus }
