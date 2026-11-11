const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const path    = require('path')
const Offer   = require('../models/Offer')
const auth    = require('../middleware/auth')

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

// ══════════════════════════════════════════════════════════════
//  PUBLIC
// ══════════════════════════════════════════════════════════════

// GET /api/offers  — active offers sorted by order
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ active: true }).sort({ order: 1, createdAt: 1 })
    res.json(offers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════

// GET /api/offers/all  — all including inactive
router.get('/all', auth, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ order: 1, createdAt: 1 })
    res.json(offers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/offers  — create
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' })
    const { tag, badge, title, subtitle, desc, order } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const offer = await Offer.create({
      img:      req.file.filename,
      tag:      tag      || 'Special Offer',
      badge:    badge    || '',
      title,
      subtitle: subtitle || '',
      desc:     desc     || '',
      order:    Number(order) || 0,
    })
    res.status(201).json(offer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/offers/:id  — update
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
    if (!offer) return res.status(404).json({ message: 'Not found' })

    const { tag, badge, title, subtitle, desc, order, active } = req.body
    if (tag      !== undefined) offer.tag      = tag
    if (badge    !== undefined) offer.badge    = badge
    if (title    !== undefined) offer.title    = title
    if (subtitle !== undefined) offer.subtitle = subtitle
    if (desc     !== undefined) offer.desc     = desc
    if (order    !== undefined) offer.order    = Number(order)
    if (active   !== undefined) offer.active   = active === 'true' || active === true
    if (req.file) offer.img = req.file.filename

    await offer.save()
    res.json(offer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/offers/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id)
    if (!offer) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
