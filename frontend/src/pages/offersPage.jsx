import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOffers, imgUrl } from '../services/api'
import '../styles/offersPage.css'

const FALLBACK = [
  { _id: '1', img: '/masala-tea.webp',    tag: 'Best Deal',       badge: 'B1G1', title: 'Buy 1 Get 1 Free',  subtitle: 'on Chai',                desc: 'Order any chai and get another one absolutely free! Valid on dine-in orders.' },
  { _id: '2', img: '/cold-coffee.jpg',    tag: 'Hot Offer',       badge: '20%',  title: '20% OFF',            subtitle: 'on Coffee & Cold Drinks', desc: 'Enjoy 20% discount on all coffee and cold drink orders above ₹100.' },
  { _id: '3', img: '/samosa.webp',        tag: 'Weekend Special', badge: '10%',  title: '10% OFF',            subtitle: 'on Snacks',               desc: 'Get 10% off on all snack items every Saturday and Sunday.' },
  { _id: '4', img: '/kashmiri-chai.webp', tag: 'New Arrival',     badge: '₹35',  title: 'Try Kashmiri Chai', subtitle: 'at ₹35 only',             desc: 'Limited time introductory price on our new aromatic Kashmiri Chai.' },
  { _id: '5', img: '/elaichi-chai.jpg',   tag: 'Combo Offer',     badge: '₹50',  title: 'Chai + Snack Combo',subtitle: 'Combo at ₹50',            desc: 'Any chai paired with any snack of your choice — all for just ₹50!' },
  { _id: '6', img: '/gulab-jamun.jpg',    tag: 'Birthday Special',badge: 'FREE', title: 'Free Dessert',       subtitle: 'on your Birthday',        desc: 'Visit us on your birthday with valid ID and enjoy a free dessert on us.' },
]

export default function OffersPage() {
  const [offers,  setOffers]  = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOffers()
      .then((data) => {
        if (data.length > 0) {
          setOffers(data.map(o => ({ ...o, img: imgUrl(o.img) })))
        }
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="offers-page">

      <div className="offers-hero">
        <h1>Special Offers</h1>
        <p>Sip more, save more!</p>
      </div>

      <div className="offers-container">
        {loading ? (
          <div className="offers-loading">
            <div className="offers-spinner" />
            <p>Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <p className="offers-empty">No active offers at the moment. Check back soon!</p>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div className="offer-card" key={offer._id}>
                <div className="offer-header">
                  <span className="offer-tag">{offer.tag}</span>
                  {offer.badge && <div className="offer-badge">{offer.badge}</div>}
                </div>
                <div className="offer-img-wrap">
                  <img src={offer.img} alt={offer.title} className="offer-img" />
                </div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-subtitle">{offer.subtitle}</p>
                <p className="offer-desc">{offer.desc}</p>
                <Link to="/menu" className="btn-primary offer-btn">
                  Grab the Offer →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
