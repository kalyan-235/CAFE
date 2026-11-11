const mongoose = require('mongoose')

const contactInfoSchema = new mongoose.Schema({
  address:  { type: String, default: 'Kalyan Cafe, Rangapuram, Telangana, India' },
  phone:    { type: String, default: '+91 98765 43210' },
  email:    { type: String, default: 'hello@klyancafe.in' },
  hours:    { type: String, default: 'Mon – Sun: 8 AM – 11 PM' },
  mapSrc:   { type: String, default: 'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7608.421961263668!2d79.531877!3d17.545139!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sin!4v1794300968965!5m2!1sen!2sin' },
  mapLink:  { type: String, default: 'https://maps.google.com/?q=17.545139,79.531877' },
}, { timestamps: true })

module.exports = mongoose.model('ContactInfo', contactInfoSchema)
