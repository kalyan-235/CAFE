const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
  img:      { type: String, required: true },
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  active:   { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Offer', offerSchema)
