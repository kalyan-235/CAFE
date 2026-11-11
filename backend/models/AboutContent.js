const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
  img:   { type: String, required: true },
  title: { type: String, required: true },
})

const aboutContentSchema = new mongoose.Schema({
  // Right side cafe image
  cafeImg:   { type: String, default: 'cafe-1.png' },

  // Left side text
  subtitle:  { type: String, default: 'More than just a cafe...' },
  tagline:   { type: String, default: "It's a feeling!" },
  desc1:     { type: String, default: 'At Kalyan Cafe, we believe in the simple joys of life — a hot cup of chai, a great conversation, and a cozy spot to sit. Our journey started with a passion for tea and a dream to bring happiness in every sip.' },
  desc2:     { type: String, default: 'We serve a variety of chai, tea, coffee and snacks, made with premium ingredients and a lot of love.' },
  signature: { type: String, default: '— Kalyan Cafe ❤️' },

  // Bottom 3 feature cards
  features: { type: [featureSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.model('AboutContent', aboutContentSchema)
