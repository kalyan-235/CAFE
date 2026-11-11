const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const path    = require('path')
const MenuItem = require('../models/MenuItem')
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

// GET /api/menu  — all available items grouped by category
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, order: 1, createdAt: 1 })
    // Group by category
    const grouped = {}
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    })
    res.json(grouped)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/menu/all  — all items (for admin, includes unavailable)
router.get('/all', auth, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, order: 1, createdAt: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════

// POST /api/menu  — create item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, desc, order } = req.body
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'name, category, price required' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image required' })
    }
    const item = await MenuItem.create({
      name, category,
      price: Number(price),
      img:   req.file.filename,
      desc:  desc || '',
      order: Number(order) || 0,
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/menu/:id  — update item (image optional)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })

    const { name, category, price, desc, available, order } = req.body
    if (name)     item.name     = name
    if (category) item.category = category
    if (price)    item.price    = Number(price)
    if (desc !== undefined) item.desc = desc
    if (available !== undefined) item.available = available === 'true' || available === true
    if (order !== undefined) item.order = Number(order)
    if (req.file) item.img = req.file.filename

    await item.save()
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/menu/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/menu/seed  — seed default items (run once)
router.post('/seed', auth, async (req, res) => {
  try {
    const count = await MenuItem.countDocuments()
    if (count > 0) return res.json({ message: 'Already seeded', count })

    const defaults = [
      // Chai & Tea
      { name: 'Masala Chai',   category: 'Chai & Tea',      price: 30,  img: 'masala-tea.webp',    desc: 'Classic spiced Indian tea' },
      { name: 'Ginger Tea',    category: 'Chai & Tea',      price: 30,  img: 'ginger-tea.webp',    desc: 'Fresh ginger brewed tea' },
      { name: 'Kashmiri Chai', category: 'Chai & Tea',      price: 40,  img: 'kashmiri-chai.webp', desc: 'Pink aromatic Kashmiri brew' },
      { name: 'Green Tea',     category: 'Chai & Tea',      price: 30,  img: 'green-tea.webp',     desc: 'Light and refreshing green tea' },
      { name: 'Lemon Tea',     category: 'Chai & Tea',      price: 30,  img: 'lemon-tea.jpg',      desc: 'Zesty lemon infused tea' },
      { name: 'Elaichi Chai',  category: 'Chai & Tea',      price: 35,  img: 'elaichi-chai.jpg',   desc: 'Cardamom flavoured chai' },
      // Coffee
      { name: 'Cafe Coffee',   category: 'Coffee',          price: 50,  img: 'cafe-coffee.jpg',    desc: 'Rich and bold espresso' },
      { name: 'Cold Coffee',   category: 'Coffee',          price: 60,  img: 'cold-coffee.jpg',    desc: 'Chilled creamy coffee' },
      { name: 'Filter Coffee', category: 'Coffee',          price: 45,  img: 'filter-coffee.jpg',  desc: 'South Indian filter decoction' },
      { name: 'Cappuccino',    category: 'Coffee',          price: 70,  img: 'cappuccino.jpg',     desc: 'Frothy espresso with milk foam' },
      { name: 'Latte',         category: 'Coffee',          price: 75,  img: 'latte.jpg',          desc: 'Smooth espresso with steamed milk' },
      { name: 'Mocha',         category: 'Coffee',          price: 80,  img: 'Mocha.jpg',          desc: 'Coffee with chocolate swirl' },
      // Special Drinks
      { name: 'Badam Milk',    category: 'Special Drinks',  price: 55,  img: 'badam-milk.jpg',     desc: 'Almond flavoured warm milk' },
      { name: 'Rose Milk',     category: 'Special Drinks',  price: 45,  img: 'rose-milk.webp',     desc: 'Sweet rose flavoured milk' },
      { name: 'Mango Lassi',   category: 'Special Drinks',  price: 60,  img: 'mango-lassi.webp',   desc: 'Thick chilled mango yogurt' },
      { name: 'Buttermilk',    category: 'Special Drinks',  price: 30,  img: 'Buttermilk.jpg',     desc: 'Salted spiced chaas' },
      { name: 'Fresh Lime',    category: 'Special Drinks',  price: 35,  img: 'fresh-lime.webp',    desc: 'Chilled fresh lime soda' },
      { name: 'Milkshake',     category: 'Special Drinks',  price: 70,  img: 'Milkshake.webp',     desc: 'Thick creamy flavoured shake' },
      // Snacks
      { name: 'Samosa',        category: 'Snacks',          price: 20,  img: 'samosa.webp',        desc: 'Crispy fried potato snack' },
      { name: 'Vada Pav',      category: 'Snacks',          price: 25,  img: 'vada-pav.jpg',       desc: 'Mumbai street style burger' },
      { name: 'Kachori',       category: 'Snacks',          price: 20,  img: 'Kachori.jpg',        desc: 'Spiced crispy fried bread' },
      { name: 'Bread Pakoda',  category: 'Snacks',          price: 30,  img: 'bread-pakoda.jpg',   desc: 'Stuffed bread in batter' },
      { name: 'Poha',          category: 'Snacks',          price: 35,  img: 'Poha.jpg',           desc: 'Light flattened rice snack' },
      { name: 'Upma',          category: 'Snacks',          price: 35,  img: 'Upma.webp',          desc: 'Semolina cooked with veggies' },
      // Sweets
      { name: 'Gulab Jamun',   category: 'Sweets',          price: 30,  img: 'gulab-jamun.jpg',    desc: 'Soft milk solids in syrup' },
      { name: 'Halwa',         category: 'Sweets',          price: 35,  img: 'Halwa.jpg',          desc: 'Rich semolina sweet' },
      { name: 'Jalebi',        category: 'Sweets',          price: 25,  img: 'Jalebi.webp',        desc: 'Crispy syrup soaked spirals' },
      { name: 'Kheer',         category: 'Sweets',          price: 40,  img: 'Kheer.jpg',          desc: 'Creamy rice pudding' },
      { name: 'Barfi',         category: 'Sweets',          price: 30,  img: 'Barfi.jpg',          desc: 'Milk fudge sweet' },
      { name: 'Peda',          category: 'Sweets',          price: 20,  img: 'Peda.jpg',           desc: 'Sweet condensed milk disc' },
    ]

    await MenuItem.insertMany(defaults)
    res.json({ message: 'Seeded successfully', count: defaults.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
