const express        = require('express')
const router         = express.Router()
const ContactInfo    = require('../models/ContactInfo')
const ContactMessage = require('../models/ContactMessage')
const auth           = require('../middleware/auth')

// ── Helper ────────────────────────────────────────────────────
async function getInfo() {
  let info = await ContactInfo.findOne()
  if (!info) info = await ContactInfo.create({})
  return info
}

// ══════════════════════════════════════════════════════════════
//  PUBLIC
// ══════════════════════════════════════════════════════════════

// GET /api/contact/info
router.get('/info', async (req, res) => {
  try {
    const info = await getInfo()
    res.json(info)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/contact/message  — submit contact form
router.post('/message', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields required' })
    }
    const msg = await ContactMessage.create({ name, email, message })
    res.status(201).json({ success: true, id: msg._id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════

// PUT /api/contact/info  — update contact details
router.put('/info', auth, async (req, res) => {
  try {
    const info = await getInfo()
    const fields = ['address', 'phone', 'email', 'hours', 'mapSrc', 'mapLink']
    fields.forEach(f => { if (req.body[f] !== undefined) info[f] = req.body[f] })
    await info.save()
    res.json(info)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/contact/messages  — all messages
router.get('/messages', auth, async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 })
    res.json(msgs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/contact/messages/:id/read  — mark as read
router.put('/messages/:id/read', auth, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: 'Not found' })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/contact/messages/:id
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
