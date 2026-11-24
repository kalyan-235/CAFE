import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaBars, FaGift, FaHome, FaImages, FaInfoCircle, FaShoppingCart, FaTimes, FaUtensils } from 'react-icons/fa'
import { useCart } from '../context/cartStore'
import '../styles/Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <nav className="navbar">
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <NavLink to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/coffee-logo.png" alt="Kalyan Cafe Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Kalyan Cafe</span>
            <span className="logo-tagline">Sip • Relax • Repeat</span>
          </div>
        </NavLink>

        <NavLink to="/cart" className="mobile-cart-link" aria-label="Shopping cart" onClick={() => setMenuOpen(false)}>
          <FaShoppingCart />
          {itemCount > 0 && <span className="cart-count">{itemCount > 99 ? '99+' : itemCount}</span>}
        </NavLink>

        <ul className={`nav-links${menuOpen ? ' mobile-menu-open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/menu" onClick={() => setMenuOpen(false)}>Menu</NavLink></li>
          <li><NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink></li>
          <li><NavLink to="/offers" onClick={() => setMenuOpen(false)}>Offers</NavLink></li>
          <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
          <li className="nav-contact-item"><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
          <li>
            <NavLink to="/cart" className="nav-order-btn" aria-label="Shopping cart" title={`Cart (${itemCount})`} onClick={() => setMenuOpen(false)}>
              <FaShoppingCart aria-hidden="true" />
              {itemCount > 0 && <span className="cart-count">{itemCount > 99 ? '99+' : itemCount}</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        <NavLink to="/" end><FaHome /><span>Home</span></NavLink>
        <NavLink to="/menu"><FaUtensils /><span>Menu</span></NavLink>
        <NavLink to="/gallery"><FaImages /><span>Gallery</span></NavLink>
        <NavLink to="/offers"><FaGift /><span>Offers</span></NavLink>
        <NavLink to="/about"><FaInfoCircle /><span>About</span></NavLink>
      </nav>
    </>
  )
}
