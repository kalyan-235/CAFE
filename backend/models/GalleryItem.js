const mongoose = require('mongoose')

const galleryItemSchema = new mongoose.Schema({
  img:       { type: String, required: true },
  label:     { type: String, required: true },
  quote:     { type: String, default: '' },
  type:      { type: String, enum: ['normal', 'wide', 'tall'], default: 'normal' },
  order:     { type: Number, default: 0 },
  visible:   { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('GalleryItem', galleryItemSchema)
