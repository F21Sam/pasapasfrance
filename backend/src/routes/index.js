const express  = require('express')
const auth     = require('../middlewares/auth.middleware')

const authCtrl  = require('../controllers/auth.controller')
const userCtrl  = require('../controllers/user.controller')
const journeyCtrl = require('../controllers/journey.controller')
const stepCtrl  = require('../controllers/step.controller')
const { upload, getDocuments, uploadDocument, deleteDocument } = require('../controllers/document.controller')
const notifCtrl = require('../controllers/notification.controller')
const adminCtrl = require('../controllers/admin.controller')
const adminAuth = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Accès refusé.' })
  next()
}

const router = express.Router()

// ── Auth (public) ──────────────────────────────────
router.post('/auth/register', authCtrl.register)
router.post('/auth/login',    authCtrl.login)
router.post('/auth/refresh',  authCtrl.refresh)

// ── Users (protégé) ────────────────────────────────
router.get   ('/users/me', auth, userCtrl.getMe)
router.put   ('/users/me', auth, userCtrl.updateMe)
router.delete('/users/me', auth, userCtrl.deleteMe)

// ── Journey (protégé) ──────────────────────────────
router.post('/journeys/generate', auth, journeyCtrl.generate)
router.get ('/journeys',          auth, journeyCtrl.getJourney)

// ── Steps / Démarches (protégé) ────────────────────
router.get('/steps',             auth, stepCtrl.getSteps)         // ?search=mot&statut=A_FAIRE
router.get('/steps/:id',         auth, stepCtrl.getStep)
router.put('/steps/:id/status',  auth, stepCtrl.updateStepStatus)

// ── Documents (protégé) ────────────────────────────
router.get   ('/documents',     auth, getDocuments)
router.post  ('/documents',     auth, upload.single('fichier'), uploadDocument)
router.delete('/documents/:id', auth, deleteDocument)

// ── Notifications (protégé) ────────────────────────
router.get('/notifications',          auth, notifCtrl.getNotifications)
router.put('/notifications/read-all', auth, notifCtrl.markAllRead)
router.put('/notifications/:id/read', auth, notifCtrl.markRead)

// ── Admin (protégé) ────────────────────────
router.get   ('/admin/stats',        auth, adminAuth, adminCtrl.getStats)
router.get   ('/admin/users',        auth, adminAuth, adminCtrl.getUsers)
router.delete('/admin/users/:id',    auth, adminAuth, adminCtrl.deleteUser)
router.get   ('/admin/steps',        auth, adminAuth, adminCtrl.getSteps)
router.post  ('/admin/steps',        auth, adminAuth, adminCtrl.createStep)
router.put   ('/admin/steps/:id',    auth, adminAuth, adminCtrl.updateStep)
router.delete('/admin/steps/:id',    auth, adminAuth, adminCtrl.deleteStep)

module.exports = router
