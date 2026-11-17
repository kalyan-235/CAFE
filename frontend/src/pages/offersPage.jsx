import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOffers, imgUrl } from '../services/api'
import '../styles/offersPage.css'

const FALLBACK = [
  { _id: '1', img: '/masala-tea.webp', title: 'Buy 1 Get 1 Free',   subtitle: 'on Chai' },
  { _id: '2', img: '/cold-coffee.jpg', title: '20% OFF',             subtitle: 'on Coffee & Cold Drinks' },
  { _id: '3', img: '/samosa.webp', title: '10% OFF',                 subtitle: 'on Snacks' },
  { _id: '4', img: '/kashmiri-chai.webp', title: 'Try Kashmiri Chai', subtitle: 'at ₹35 only' },
  { _id: '5', img: '/elaichi-chai.jpg', title: 'Chai + Snack Combo', subtitle: 'Combo at ₹50' },
  { _id: '6', img: '/gulab-jamun.jpg', title: 'Free Dessert',        subtitle: 'on your Birthday' },
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
                <div className="offer-img-wrap">
                  <img src={offer.img} alt={offer.title} className="offer-img" />
                </div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-subtitle">{offer.subtitle}</p>
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
