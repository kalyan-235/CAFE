import { useState, useEffect } from 'react'
import { getGalleryItems, imgUrl } from '../services/api'
import '../styles/galleryPage.css'

const FALLBACK = [
  { _id: '1', img: '/gallery-1.jpeg', label: 'Our Cozy Space',   quote: 'Where every corner tells a story ☕',       type: 'wide' },
  { _id: '2', img: '/gallery-2.jpeg', label: 'Chai Moments',     quote: 'Warmth in every sip 🍵',                    type: 'normal' },
  { _id: '3', img: '/Jalebi.webp',    label: 'Sweet Treats',     quote: 'Sweet moments, sweeter treats 🍯',          type: 'normal' },
  { _id: '4', img: '/gallery-4.jpeg', label: 'Hangout Spot',     quote: 'Your favourite hangout spot 🏡',            type: 'normal' },
  { _id: '5', img: '/samosa.webp',    label: 'Crispy Snacks',    quote: 'Crispy bites, happy hearts 😋',             type: 'normal' },
  { _id: '6', img: '/gallery-3.jpeg', label: 'Brewed With Love', quote: 'Brewed with love, served with soul 💛',     type: 'wide' },
  { _id: '7', img: '/gallery-4.jpeg', label: 'Good Vibes',       quote: 'Good vibes only — come as you are ✨',      type: 'normal' },
  { _id: '8', img: '/gallery-1.jpeg', label: 'Chai & Friends',   quote: 'A cup of chai makes everything better 🍵', type: 'normal' },
]

export default function GalleryPage() {
  const [items,   setItems]   = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryItems()
      .then((data) => {
        if (data.length > 0) {
          setItems(data.map(item => ({ ...item, img: imgUrl(item.img) })))
        }
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false))
  }, [])

  // Split: first 6 go into grid, rest into photos row
  const gridItems  = items.slice(0, 6)
  const photoItems = items.slice(6)

  return (
    <div className="gallery-page">

      <div className="gallery-hero">
        <h1>Our Cafe Gallery</h1>
        <p>A glimpse of our cozy space &amp; delicious treats</p>
      </div>

      <div className="gallery-container">

        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-spinner" />
            <p>Loading gallery...</p>
          </div>
        ) : (
          <>
            {/* Main masonry grid — first 6 items */}
            <div className="gallery-grid">
              {gridItems.map((item, i) => (
                <div
                  className={`gallery-item item-${item.type} item-${i + 1}`}
                  key={item._id}
                >
                  <div className="gallery-inner">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="gallery-item-img"
                    />
                    <div className="gallery-overlay">
                      <p className="gallery-overlay-label">{item.label}</p>
                      {item.quote && (
                        <p className="gallery-overlay-quote">"{item.quote}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional photos row */}
            {photoItems.length > 0 && (
              <div className="gallery-photos">
                {photoItems.map((item) => (
                  <div className="gallery-photo" key={item._id}>
                    <img src={item.img} alt={item.label} />
                    <div className="photo-overlay">
                      <p className="photo-label">{item.label}</p>
                      {item.quote && (
                        <p className="photo-quote">"{item.quote}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="gallery-footer-banner">
        <span>📷 Good Times. Great Coffee.</span>
      </div>
      <div className="menu-star-divider">
        <span>✦</span>
      </div>

    </div>
  )
}
