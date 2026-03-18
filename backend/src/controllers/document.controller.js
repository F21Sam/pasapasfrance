const multer = require('multer')
const path   = require('path')
const fs     = require('fs')
const prisma = require('../utils/prisma')

// ── Config Multer ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = process.env.UPLOAD_DIR || 'uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const unique = `${req.userId}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, unique)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format non supporté. PDF, JPG et PNG uniquement.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
})

// ── GET /documents ──
const getDocuments = async (req, res) => {
  try {
    const { stepId } = req.query

    const documents = await prisma.document.findMany({
      where: {
        userId: req.userId,
        ...(stepId ? { stepId: parseInt(stepId) } : {})
      },
      include: { step: { select: { titre: true } } },
      orderBy: { createdAt: 'desc' }
    })

    res.json(documents)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── POST /documents ── (upload)
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' })
    }

    const { nom, stepId } = req.body

    const document = await prisma.document.create({
      data: {
        nom:      nom || req.file.originalname,
        chemin:   req.file.path,
        taille:   req.file.size,
        mimeType: req.file.mimetype,
        statut:   'FOURNI',
        userId:   req.userId,
        stepId:   stepId ? parseInt(stepId) : null,
      }
    })

    res.status(201).json({ message: 'Document uploadé.', document })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

// ── DELETE /documents/:id ──
const deleteDocument = async (req, res) => {
  try {
    const docId = parseInt(req.params.id)

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: req.userId }
    })
    if (!doc) return res.status(404).json({ error: 'Document introuvable.' })

    // Supprimer le fichier physique
    if (doc.chemin && fs.existsSync(doc.chemin)) {
      fs.unlinkSync(doc.chemin)
    }

    await prisma.document.delete({ where: { id: docId } })

    res.json({ message: 'Document supprimé.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
}

module.exports = { upload, getDocuments, uploadDocument, deleteDocument }
