const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const HomeContent = require('../models/HomeContent')
const auth = require('../middleware/auth')

// ── Multer setup ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
    cb(null, unique + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) cb(null, true)
  else cb(new Error('Images only (jpeg, jpg, png, webp, gif)'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

// ── Helper: get or create the single HomeContent doc ─────────
async function getContent() {
  let content = await HomeContent.findOne()
  if (!content) content = await HomeContent.create({})
  return content
}

// ══════════════════════════════════════════════════════════════
//  PUBLIC ROUTES — no auth needed
// ══════════════════════════════════════════════════════════════

// GET /api/content  — full home content
router.get('/', async (req, res) => {
  try {
    const content = await getContent()
    res.json(content)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN ROUTES — require JWT
// ══════════════════════════════════════════════════════════════

// ── HERO IMAGE ───────────────────────────────────────────────

// PUT /api/content/hero  (multipart: heroImage file)
router.put('/hero', auth, upload.single('heroImage'), async (req, res) => {
  try {
    const content = await getContent()

    if (req.file) {
      // Delete old uploaded hero if it exists in uploads/
      if (content.heroBgImage && !content.heroBgImage.startsWith('cafe-')) {
        const oldPath = path.join(__dirname, '../uploads', content.heroBgImage)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      content.heroBgImage = req.file.filename
    }

    await content.save()
    res.json({ heroBgImage: content.heroBgImage })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── SPECIALTIES ───────────────────────────────────────────────

// PUT /api/content/specialties  (JSON body: array of {name, img, desc})
// Image upload for specialty: POST /api/content/specialties/upload
router.post('/specialties/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ filename: req.file.filename })
})

// PUT /api/content/specialties  — save full specialties array
router.put('/specialties', auth, async (req, res) => {
  try {
    const { specialties } = req.body
    if (!Array.isArray(specialties)) {
      return res.status(400).json({ message: 'specialties must be an array' })
    }
    const content = await getContent()
    content.specialties = specialties.slice(0, 6)
    await content.save()
    res.json({ specialties: content.specialties })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── WHY US ────────────────────────────────────────────────────

// POST /api/content/whyus/upload
router.post('/whyus/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ filename: req.file.filename })
})

// PUT /api/content/whyus  — save full whyUs array
router.put('/whyus', auth, async (req, res) => {
  try {
    const { whyUs } = req.body
    if (!Array.isArray(whyUs)) {
      return res.status(400).json({ message: 'whyUs must be an array' })
    }
    const content = await getContent()
    content.whyUs = whyUs.slice(0, 4)
    await content.save()
    res.json({ whyUs: content.whyUs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── ABOUT PAGE ────────────────────────────────────────────────

// PUT /api/content/about  — save text fields
router.put('/about', auth, async (req, res) => {
  try {
    const content = await getContent()
    const fields = ['aboutSubtitle','aboutTitle','aboutTagline','aboutDesc1','aboutDesc2','aboutSignature','aboutBannerHead','aboutBannerSub']
    fields.forEach(f => { if (req.body[f] !== undefined) content[f] = req.body[f] })
    await content.save()
    res.json(content)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/content/about/cafe-image  — upload cafe image (right side)
router.put('/about/cafe-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const content = await getContent()
    content.aboutCafeImg = req.file.filename
    await content.save()
    res.json({ aboutCafeImg: content.aboutCafeImg })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/content/about/banner-image  — upload banner bg image
router.put('/about/banner-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const content = await getContent()
    content.aboutBannerImg = req.file.filename
    await content.save()
    res.json({ aboutBannerImg: content.aboutBannerImg })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/content/about/features/upload
router.post('/about/features/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ filename: req.file.filename })
})

// PUT /api/content/about/features  — save features array
router.put('/about/features', auth, async (req, res) => {
  try {
    const { features } = req.body
    if (!Array.isArray(features)) return res.status(400).json({ message: 'features must be an array' })
    const content = await getContent()
    content.aboutFeatures = features.slice(0, 3)
    await content.save()
    res.json({ aboutFeatures: content.aboutFeatures })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
