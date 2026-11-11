require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/content', require('./routes/content'))
app.use('/api/menu',    require('./routes/menu'))
app.use('/api/gallery', require('./routes/gallery'))
app.use('/api/offers',  require('./routes/offers'))
app.use('/api/about',   require('./routes/about'))
app.use('/api/contact', require('./routes/contact'))

// ── Seeders ───────────────────────────────────────────────────
const Admin          = require('./models/Admin')
const MenuItem       = require('./models/MenuItem')
const GalleryItem    = require('./models/GalleryItem')
const Offer          = require('./models/Offer')
const AboutContent   = require('./models/AboutContent')
const ContactInfo    = require('./models/ContactInfo')

async function seedAdmin() {
  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME })
  if (!existing) {
    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    })
    console.log('✅ Admin user created:', process.env.ADMIN_USERNAME)
  }
}

async function seedMenuItems() {
  const count = await MenuItem.countDocuments()
  if (count > 0) return // already seeded

  const defaults = [
    // Chai & Tea
    { name: 'Masala Chai',   category: 'Chai & Tea',     price: 30,  img: 'masala-tea.webp',    desc: 'Classic spiced Indian tea' },
    { name: 'Ginger Tea',    category: 'Chai & Tea',     price: 30,  img: 'ginger-tea.webp',    desc: 'Fresh ginger brewed tea' },
    { name: 'Kashmiri Chai', category: 'Chai & Tea',     price: 40,  img: 'kashmiri-chai.webp', desc: 'Pink aromatic Kashmiri brew' },
    { name: 'Green Tea',     category: 'Chai & Tea',     price: 30,  img: 'green-tea.webp',     desc: 'Light and refreshing green tea' },
    { name: 'Lemon Tea',     category: 'Chai & Tea',     price: 30,  img: 'lemon-tea.jpg',      desc: 'Zesty lemon infused tea' },
    { name: 'Elaichi Chai',  category: 'Chai & Tea',     price: 35,  img: 'elaichi-chai.jpg',   desc: 'Cardamom flavoured chai' },
    // Coffee
    { name: 'Cafe Coffee',   category: 'Coffee',         price: 50,  img: 'cafe-coffee.jpg',    desc: 'Rich and bold espresso' },
    { name: 'Cold Coffee',   category: 'Coffee',         price: 60,  img: 'cold-coffee.jpg',    desc: 'Chilled creamy coffee' },
    { name: 'Filter Coffee', category: 'Coffee',         price: 45,  img: 'filter-coffee.jpg',  desc: 'South Indian filter decoction' },
    { name: 'Cappuccino',    category: 'Coffee',         price: 70,  img: 'cappuccino.jpg',     desc: 'Frothy espresso with milk foam' },
    { name: 'Latte',         category: 'Coffee',         price: 75,  img: 'latte.jpg',          desc: 'Smooth espresso with steamed milk' },
    { name: 'Mocha',         category: 'Coffee',         price: 80,  img: 'Mocha.jpg',          desc: 'Coffee with chocolate swirl' },
    // Special Drinks
    { name: 'Badam Milk',    category: 'Special Drinks', price: 55,  img: 'badam-milk.jpg',     desc: 'Almond flavoured warm milk' },
    { name: 'Rose Milk',     category: 'Special Drinks', price: 45,  img: 'rose-milk.webp',     desc: 'Sweet rose flavoured milk' },
    { name: 'Mango Lassi',   category: 'Special Drinks', price: 60,  img: 'mango-lassi.webp',   desc: 'Thick chilled mango yogurt' },
    { name: 'Buttermilk',    category: 'Special Drinks', price: 30,  img: 'Buttermilk.jpg',     desc: 'Salted spiced chaas' },
    { name: 'Fresh Lime',    category: 'Special Drinks', price: 35,  img: 'fresh-lime.webp',    desc: 'Chilled fresh lime soda' },
    { name: 'Milkshake',     category: 'Special Drinks', price: 70,  img: 'Milkshake.webp',     desc: 'Thick creamy flavoured shake' },
    // Snacks
    { name: 'Samosa',        category: 'Snacks',         price: 20,  img: 'samosa.webp',        desc: 'Crispy fried potato snack' },
    { name: 'Vada Pav',      category: 'Snacks',         price: 25,  img: 'vada-pav.jpg',       desc: 'Mumbai street style burger' },
    { name: 'Kachori',       category: 'Snacks',         price: 20,  img: 'Kachori.jpg',        desc: 'Spiced crispy fried bread' },
    { name: 'Bread Pakoda',  category: 'Snacks',         price: 30,  img: 'bread-pakoda.jpg',   desc: 'Stuffed bread in batter' },
    { name: 'Poha',          category: 'Snacks',         price: 35,  img: 'Poha.jpg',           desc: 'Light flattened rice snack' },
    { name: 'Upma',          category: 'Snacks',         price: 35,  img: 'Upma.webp',          desc: 'Semolina cooked with veggies' },
    // Sweets
    { name: 'Gulab Jamun',   category: 'Sweets',         price: 30,  img: 'gulab-jamun.jpg',    desc: 'Soft milk solids in syrup' },
    { name: 'Halwa',         category: 'Sweets',         price: 35,  img: 'Halwa.jpg',          desc: 'Rich semolina sweet' },
    { name: 'Jalebi',        category: 'Sweets',         price: 25,  img: 'Jalebi.webp',        desc: 'Crispy syrup soaked spirals' },
    { name: 'Kheer',         category: 'Sweets',         price: 40,  img: 'Kheer.jpg',          desc: 'Creamy rice pudding' },
    { name: 'Barfi',         category: 'Sweets',         price: 30,  img: 'Barfi.jpg',          desc: 'Milk fudge sweet' },
    { name: 'Peda',          category: 'Sweets',         price: 20,  img: 'Peda.jpg',           desc: 'Sweet condensed milk disc' },
  ]

  await MenuItem.insertMany(defaults)
  console.log(`✅ Menu seeded with ${defaults.length} items`)
}

async function seedGallery() {
  const count = await GalleryItem.countDocuments()
  if (count > 0) return

  const defaults = [
    { img: 'gallery-1.jpeg', label: 'Our Cozy Space',   quote: 'Where every corner tells a story ☕',          type: 'wide',   order: 1 },
    { img: 'gallery-2.jpeg', label: 'Chai Moments',     quote: 'Warmth in every sip 🍵',                       type: 'normal', order: 2 },
    { img: 'Jalebi.webp',    label: 'Sweet Treats',     quote: 'Sweet moments, sweeter treats 🍯',             type: 'normal', order: 3 },
    { img: 'gallery-4.jpeg', label: 'Hangout Spot',     quote: 'Your favourite hangout spot 🏡',               type: 'normal', order: 4 },
    { img: 'samosa.webp',    label: 'Crispy Snacks',    quote: 'Crispy bites, happy hearts 😋',                type: 'normal', order: 5 },
    { img: 'gallery-3.jpeg', label: 'Brewed With Love', quote: 'Brewed with love, served with soul 💛',        type: 'wide',   order: 6 },
    { img: 'gallery-4.jpeg', label: 'Good Vibes',       quote: 'Good vibes only — come as you are ✨',         type: 'normal', order: 7 },
    { img: 'gallery-1.jpeg', label: 'Chai & Friends',   quote: 'A cup of chai makes everything better 🍵',    type: 'normal', order: 8 },
  ]

  await GalleryItem.insertMany(defaults)
  console.log(`✅ Gallery seeded with ${defaults.length} items`)
}

async function seedOffers() {
  const count = await Offer.countDocuments()
  if (count > 0) return

  const defaults = [
    { img: 'masala-tea.webp',    tag: 'Best Deal',        badge: 'B1G1', title: 'Buy 1 Get 1 Free',    subtitle: 'on Chai',                desc: 'Order any chai and get another one absolutely free! Valid on dine-in orders.', order: 1 },
    { img: 'cold-coffee.jpg',    tag: 'Hot Offer',         badge: '20%',  title: '20% OFF',              subtitle: 'on Coffee & Cold Drinks', desc: 'Enjoy 20% discount on all coffee and cold drink orders above ₹100.',          order: 2 },
    { img: 'samosa.webp',        tag: 'Weekend Special',   badge: '10%',  title: '10% OFF',              subtitle: 'on Snacks',               desc: 'Get 10% off on all snack items every Saturday and Sunday.',                  order: 3 },
    { img: 'kashmiri-chai.webp', tag: 'New Arrival',       badge: '₹35',  title: 'Try Kashmiri Chai',    subtitle: 'at ₹35 only',             desc: 'Limited time introductory price on our new aromatic Kashmiri Chai.',         order: 4 },
    { img: 'elaichi-chai.jpg',   tag: 'Combo Offer',       badge: '₹50',  title: 'Chai + Snack Combo',   subtitle: 'Combo at ₹50',            desc: 'Any chai paired with any snack of your choice — all for just ₹50!',         order: 5 },
    { img: 'gulab-jamun.jpg',    tag: 'Birthday Special',  badge: 'FREE', title: 'Free Dessert',         subtitle: 'on your Birthday',        desc: 'Visit us on your birthday with valid ID and enjoy a free dessert on us.',    order: 6 },
  ]

  await Offer.insertMany(defaults)
  console.log(`✅ Offers seeded with ${defaults.length} items`)
}

async function seedAbout() {
  const count = await AboutContent.countDocuments()
  if (count > 0) return
  await AboutContent.create({
    cafeImg:   'cafe-1.png',
    subtitle:  'More than just a cafe...',
    tagline:   "It's a feeling!",
    desc1:     'At Kalyan Cafe, we believe in the simple joys of life — a hot cup of chai, a great conversation, and a cozy spot to sit. Our journey started with a passion for tea and a dream to bring happiness in every sip.',
    desc2:     'We serve a variety of chai, tea, coffee and snacks, made with premium ingredients and a lot of love.',
    signature: '— Kalyan Cafe ❤️',
    features: [
      { img: 'leaf-image.webp',  title: 'Quality Ingredients' },
      { img: 'heart-image.webp', title: 'Warm Ambiance' },
      { img: 'smile-image.webp', title: 'Happy Customers' },
    ],
  })
  console.log('✅ About content seeded')
}

async function seedContact() {
  const count = await ContactInfo.countDocuments()
  if (count > 0) return
  await ContactInfo.create({})
  console.log('✅ Contact info seeded')
}

// ── MongoDB connect ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    await seedAdmin()
    await seedMenuItems()
    await seedGallery()
    await seedOffers()
    await seedAbout()
    await seedContact()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })
