import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/homePage'
import MenuPage from './pages/menuPage'
import GalleryPage from './pages/galleryPage'
import OffersPage from './pages/offersPage'
import AboutPage from './pages/aboutPage'
import ContactPage from './pages/contactPage'
import AdminPage from './pages/adminPage'
import CartPage from './pages/cartPage'
import { CartProvider } from './context/CartContext'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Admin route — no Navbar/Footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Public routes — with Navbar + Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="app-main">
                <Routes>
                  <Route path="/"        element={<HomePage />} />
                  <Route path="/menu"    element={<MenuPage />} />
                  <Route path="/cart"    element={<CartPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/offers"  element={<OffersPage />} />
                  <Route path="/about"   element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
