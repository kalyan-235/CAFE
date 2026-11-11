import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHomeContent, imgUrl } from '../services/api'
import '../styles/homePage.css'

// ── Static fallbacks (used if DB is empty) ───────────────────
const DEFAULT_SPECIALTIES = [
  { name: 'Masala Chai',   img: '/masala-tea.webp',    desc: 'Classic spiced brew' },
  { name: 'Ginger Tea',    img: '/ginger-tea.webp',    desc: 'Fresh & zingy' },
  { name: 'Kashmiri Chai', img: '/kashmiri-chai.webp', desc: 'Pink & aromatic' },
  { name: 'Green Tea',     img: '/green-tea.webp',     desc: 'Light & healthy' },
  { name: 'Cafe Coffee',   img: '/cafe-coffee.jpg',    desc: 'Rich & bold' },
  { name: 'Cold Coffee',   img: '/cold-coffee.jpg',    desc: 'Cool & creamy' },
]

const DEFAULT_WHY_US = [
  { img: '/leaf-image.webp',  title: 'Premium Quality Ingredients' },
  { img: '/cafe-coffee.jpg',  title: 'Unique Flavours & Varieties' },
  { img: '/heart-image.webp', title: 'Cozy & Friendly Ambience' },
  { img: '/smile-image.webp', title: 'Great Taste, Always!' },
]

export default function HomePage() {
  const [heroBg,       setHeroBg]       = useState('/cafe-home-page.jpeg')
  const [specialties,  setSpecialties]  = useState(DEFAULT_SPECIALTIES)
  const [whyUs,        setWhyUs]        = useState(DEFAULT_WHY_US)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.heroBgImage)              setHeroBg(imgUrl(data.heroBgImage))
        if (data.specialties?.length > 0)  setSpecialties(data.specialties.map(s => ({ ...s, img: imgUrl(s.img) })))
        if (data.whyUs?.length > 0)        setWhyUs(data.whyUs.map(w => ({ ...w, img: imgUrl(w.img) })))
      })
      .catch(() => { /* backend offline — use fallbacks */ })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">

      {/* ===== HERO ===== */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-welcome">Welcome to</p>
          <h1 className="hero-title">Kalyan Cafe</h1>
          <div className="divider">✦</div>
          <p className="hero-tagline">Sip • Relax • Repeat</p>
          <p className="hero-sub">
            Discover a world of flavours with our<br />
            special Chai, Tea and more...
          </p>
          <Link to="/menu" className="btn-primary hero-btn">
            Explore Menu →
          </Link>
        </div>

        {/* Wave bottom border */}
        <div className="hero-bottom-wave">
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 C240,90 480,0 720,60 C960,120 1200,20 1440,60 L1440,90 L0,90 Z" fill="#fdf6ec" />
          </svg>
        </div>
      </section>

      {/* ===== SPECIALTIES ===== */}
      <section className="specialties-section">
        <div className="section-title">
          <div className="divider">✦</div>
          <h2>Our Specialties</h2>
          <p>A perfect blend of tradition and taste</p>
        </div>
        <div className="specialties-grid">
          {specialties.map((item) => (
            <div className="specialty-card" key={item.name}>
              <div className="specialty-circle">
                <img src={item.img} alt={item.name} className="specialty-img" />
              </div>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-section">
        <div className="why-title">
          <h2>Why Choose <span>Kalyan Cafe?</span></h2>
          <p>We brew more than just chai — we craft an experience</p>
        </div>
        <div className="why-cards-row">
          {whyUs.map((item) => (
            <div className="why-card" key={item.title}>
              <div className="why-icon-wrap">
                <img src={item.img} alt={item.title} className="why-icon-img" />
              </div>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VISIT BANNER ===== */}
      <section className="visit-section">
        <img src="/cafe-2.png" alt="Kalyan Cafe Interior" className="visit-bg" />
        <div className="visit-overlay" />
        <div className="visit-content">
          <div className="visit-left">
            <h2>Visit Kalyan Cafe Today!</h2>
            <p>Take a break, enjoy a cup, and feel the difference.</p>
            <Link to="/contact" className="btn-outline visit-btn">
              Find Us →
            </Link>
          </div>
          <div className="visit-right">
            <p className="visit-brand">Kalyan Cafe</p>
          </div>
        </div>
      </section>

    </div>
  )
}
