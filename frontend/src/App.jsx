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
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin route — no Navbar/Footer */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Public routes — with Navbar + Footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/"        element={<HomePage />} />
                <Route path="/menu"    element={<MenuPage />} />
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
    </BrowserRouter>
  )
}

export default App
