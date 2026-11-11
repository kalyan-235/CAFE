const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Chai & Tea', 'Coffee', 'Special Drinks', 'Snacks', 'Sweets'],
  },
  price:    { type: Number, required: true },
  img:      { type: String, required: true },
  desc:     { type: String, default: '' },
  available: { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('MenuItem', menuItemSchema)
