const express    = require('express')
const router     = express.Router()
const multer     = require('multer')
const path       = require('path')
const GalleryItem = require('../models/GalleryItem')
const auth       = require('../middleware/auth')

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
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

// ══════════════════════════════════════════════════════════════
//  PUBLIC
// ══════════════════════════════════════════════════════════════

// GET /api/gallery  — visible items sorted by order
router.get('/', async (req, res) => {
  try {
    const items = await GalleryItem.find({ visible: true }).sort({ order: 1, createdAt: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════

// GET /api/gallery/all  — all items including hidden
router.get('/all', auth, async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/gallery  — add new item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' })
    const { label, quote, type, order } = req.body
    const item = await GalleryItem.create({
      img:   req.file.filename,
      label: label || 'Kalyan Cafe',
      quote: quote || '',
      type:  type  || 'normal',
      order: Number(order) || 0,
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/gallery/:id  — update (image optional)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })

    const { label, quote, type, order, visible } = req.body
    if (label   !== undefined) item.label   = label
    if (quote   !== undefined) item.quote   = quote
    if (type    !== undefined) item.type    = type
    if (order   !== undefined) item.order   = Number(order)
    if (visible !== undefined) item.visible = visible === 'true' || visible === true
    if (req.file) item.img = req.file.filename

    await item.save()
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/gallery/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
