const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' })
  }

  try {
    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await admin.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, username: admin.username })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/verify  — check if token is still valid
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, username: req.admin.username })
})

module.exports = router
