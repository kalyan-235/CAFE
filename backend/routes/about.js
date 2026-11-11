const express      = require('express')
const router       = express.Router()
const multer       = require('multer')
const path         = require('path')
const AboutContent = require('../models/AboutContent')
const auth         = require('../middleware/auth')

// ── Multer ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
    cb(null, unique + path.extname(file.originalname))
  },
})
const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase())
  ok ? cb(null, true) : cb(new Error('Images only'))
}
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

// ── Helper ────────────────────────────────────────────────────
async function getAbout() {
  let about = await AboutContent.findOne()
  if (!about) about = await AboutContent.create({})
  return about
}

// ══════════════════════════════════════════════════════════════
//  PUBLIC
// ══════════════════════════════════════════════════════════════

// GET /api/about
router.get('/', async (req, res) => {
  try {
    const about = await getAbout()
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════

// PUT /api/about/text  — save all text fields
router.put('/text', auth, async (req, res) => {
  try {
    const about = await getAbout()
    const fields = ['subtitle', 'tagline', 'desc1', 'desc2', 'signature']
    fields.forEach(f => { if (req.body[f] !== undefined) about[f] = req.body[f] })
    await about.save()
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/about/cafe-image  — upload right side cafe image
router.put('/cafe-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const about = await getAbout()
    about.cafeImg = req.file.filename
    await about.save()
    res.json({ cafeImg: about.cafeImg })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/about/features/upload  — upload single feature image
router.post('/features/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ filename: req.file.filename })
})

// PUT /api/about/features  — save all 3 feature cards
router.put('/features', auth, async (req, res) => {
  try {
    const { features } = req.body
    if (!Array.isArray(features)) return res.status(400).json({ message: 'features must be an array' })
    const about = await getAbout()
    about.features = features.slice(0, 3)
    await about.save()
    res.json({ features: about.features })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
