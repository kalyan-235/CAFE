import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="footer">

      {/* Top row — logo + nav */}
      <div className="footer-top">
        <div className="footer-logo">
          <img src="/coffee-logo.png" alt="Kalyan Cafe Logo" className="logo-img" />
          <div>
            <div className="logo-name">Kalyan Cafe</div>
            <div className="logo-tagline">Sip • Relax • Repeat</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom — social icons center, copyright below */}
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
        </div>
        <div className="footer-copy">
          © 2025 Kalyan Cafe. All rights reserved.
        </div>
      </div>

    </footer>
  )
}
