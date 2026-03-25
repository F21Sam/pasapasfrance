const { prisma } = require('../utils/prisma')

// GET /admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalSteps, totalDocuments, totalJourneys, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.step.count(),
      prisma.document.count(),
      prisma.journey.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id:true, prenom:true, email:true, createdAt:true, profile:{ select:{ statut:true } } }
      }),
    ])
    res.json({ totalUsers, totalSteps, totalDocuments, totalJourneys, recentUsers })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// GET /admin/users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id:true, prenom:true, email:true, role:true, createdAt:true, profile:{ select:{ statut:true } } }
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// DELETE /admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.user.delete({ where: { id: parseInt(id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' })
  }
}

// GET /admin/steps
const getSteps = async (req, res) => {
  try {
    const steps = await prisma.step.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(steps)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// POST /admin/steps
const createStep = async (req, res) => {
  try {
    const { titre, description, organisme, delai, priorite, siteOfficiel } = req.body
    const step = await prisma.step.create({
      data: { titre, description, organisme, delai, priorite, siteOfficiel, actif: true }
    })
    res.status(201).json(step)
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création.' })
  }
}

// PUT /admin/steps/:id
const updateStep = async (req, res) => {
  try {
    const { id } = req.params
    const { titre, description, organisme, delai, priorite, siteOfficiel } = req.body
    const step = await prisma.step.update({
      where: { id: parseInt(id) },
      data:  { titre, description, organisme, delai, priorite, siteOfficiel }
    })
    res.json(step)
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' })
  }
}

// DELETE /admin/steps/:id
const deleteStep = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.step.delete({ where: { id: parseInt(id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' })
  }
}

module.exports = { getStats, getUsers, deleteUser, getSteps, createStep, updateStep, deleteStep }
