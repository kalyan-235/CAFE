import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <img src="/coffee-logo.png" alt="Kalyan Cafe Logo" className="logo-img" />
        <div className="logo-text">
          <span className="logo-name">Kalyan Cafe</span>
          <span className="logo-tagline">Sip • Relax • Repeat</span>
        </div>
      </NavLink>

      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/menu">Menu</NavLink></li>
        <li><NavLink to="/gallery">Gallery</NavLink></li>
        <li><NavLink to="/offers">Offers</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        <li>
          <NavLink to="/menu" className="nav-order-btn">
            🛒 Order Online
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
