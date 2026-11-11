const mongoose = require('mongoose')

const specialtySchema = new mongoose.Schema({
  name: { type: String, required: true },
  img:  { type: String, required: true },
  desc: { type: String, default: '' },
})

const whyUsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img:   { type: String, required: true },
})

const homeContentSchema = new mongoose.Schema({
  // Hero
  heroBgImage: { type: String, default: 'cafe-home-page.jpeg' },
  // Specialties (max 6)
  specialties: { type: [specialtySchema], default: [] },
  // Why Us (max 4)
  whyUs: { type: [whyUsSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.model('HomeContent', homeContentSchema)
