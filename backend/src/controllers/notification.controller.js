const prisma = require('../utils/prisma')

// ── GET /notifications ──
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where:   { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take:    50
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── PUT /notifications/:id/read ──
const markRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { id: parseInt(req.params.id), userId: req.userId },
      data:  { lu: true }
    })
    res.json({ message: 'Notification marquée comme lue.' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── PUT /notifications/read-all ──
const markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, lu: false },
      data:  { lu: true }
    })
    res.json({ message: 'Toutes les notifications marquées comme lues.' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

module.exports = { getNotifications, markRead, markAllRead }
