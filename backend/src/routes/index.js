const express  = require('express')
const auth     = require('../middlewares/auth.middleware')

const authCtrl  = require('../controllers/auth.controller')
const userCtrl  = require('../controllers/user.controller')
const journeyCtrl = require('../controllers/journey.controller')
const stepCtrl  = require('../controllers/step.controller')
const { upload, getDocuments, uploadDocument, deleteDocument } = require('../controllers/document.controller')
const notifCtrl = require('../controllers/notification.controller')

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

module.exports = router
