import { useState, useEffect } from 'react'
import { getContactInfo, submitContactMessage } from '../services/api'
import '../styles/contactPage.css'

const DEFAULT_INFO = {
  address: 'Kalyan Cafe, Rangapuram, Telangana, India',
  phone:   '+91 98765 43210',
  email:   'hello@klyancafe.in',
  hours:   'Mon – Sun: 8 AM – 11 PM',
  mapSrc:  'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7608.421961263668!2d79.531877!3d17.545139!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sin!4v1794300968965!5m2!1sen!2sin',
  mapLink: 'https://maps.google.com/?q=17.545139,79.531877',
}

export default function ContactPage() {
  const [info,    setInfo]    = useState(DEFAULT_INFO)
  const [form,    setForm]    = useState({ name: '', email: '', message: '' })
  const [sent,    setSent]    = useState(false)
  const [sending, setSending] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getContactInfo()
      .then(data => setInfo(data))
      .catch(() => {/* use defaults */})
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await submitContactMessage(form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-page">

      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="contact-container">

        {/* LEFT — Info Cards + Map */}
        <div className="contact-left">
          <h2>Get in Touch</h2>
          <p className="contact-intro">
            Come visit us, give us a call, or drop us a message!
          </p>

          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <div>
                <h4>Our Address</h4>
                <p>{info.address}</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">📞</span>
              <div>
                <h4>Phone</h4>
                <p>{info.phone}</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">📧</span>
              <div>
                <h4>Email</h4>
                <p>{info.email}</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🕐</span>
              <div>
                <h4>Opening Hours</h4>
                <p>{info.hours}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="map-wrap">
            <div className="map-iframe-box">
              <iframe
                title="Kalyan Cafe Location"
                src={info.mapSrc}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                href={info.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-click-overlay"
                aria-label="Open in Google Maps"
              >
                <span className="map-click-label">📍 Open in Google Maps ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT — Contact Form */}
        <div className="contact-form-wrap">
          <h2>Send Message</h2>

          {sent && (
            <div className="success-msg">
              ✅ Thank you! Your message has been sent. We'll get back to you soon.
            </div>
          )}
          {error && (
            <div className="error-msg">❌ {error}</div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary send-btn"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Message 📨'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
