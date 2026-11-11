import { useState, useEffect } from 'react'
import { getMenuItems, imgUrl } from '../services/api'
import '../styles/menuPage.css'

const CATEGORIES = ['Chai & Tea', 'Coffee', 'Special Drinks', 'Snacks', 'Sweets']

// Static fallback
const FALLBACK = {
  'Chai & Tea': [
    { _id: '1', name: 'Masala Chai',   price: 30, img: '/masala-tea.webp',    desc: 'Classic spiced Indian tea' },
    { _id: '2', name: 'Ginger Tea',    price: 30, img: '/ginger-tea.webp',    desc: 'Fresh ginger brewed tea' },
    { _id: '3', name: 'Kashmiri Chai', price: 40, img: '/kashmiri-chai.webp', desc: 'Pink aromatic Kashmiri brew' },
    { _id: '4', name: 'Green Tea',     price: 30, img: '/green-tea.webp',     desc: 'Light and refreshing green tea' },
    { _id: '5', name: 'Lemon Tea',     price: 30, img: '/lemon-tea.jpg',      desc: 'Zesty lemon infused tea' },
    { _id: '6', name: 'Elaichi Chai',  price: 35, img: '/elaichi-chai.jpg',   desc: 'Cardamom flavoured chai' },
  ],
  'Coffee': [
    { _id: '7',  name: 'Cafe Coffee',   price: 50, img: '/cafe-coffee.jpg',   desc: 'Rich and bold espresso' },
    { _id: '8',  name: 'Cold Coffee',   price: 60, img: '/cold-coffee.jpg',   desc: 'Chilled creamy coffee' },
    { _id: '9',  name: 'Filter Coffee', price: 45, img: '/filter-coffee.jpg', desc: 'South Indian filter decoction' },
    { _id: '10', name: 'Cappuccino',    price: 70, img: '/cappuccino.jpg',    desc: 'Frothy espresso with milk foam' },
    { _id: '11', name: 'Latte',         price: 75, img: '/latte.jpg',         desc: 'Smooth espresso with steamed milk' },
    { _id: '12', name: 'Mocha',         price: 80, img: '/Mocha.jpg',         desc: 'Coffee with chocolate swirl' },
  ],
  'Special Drinks': [
    { _id: '13', name: 'Badam Milk',  price: 55, img: '/badam-milk.jpg',   desc: 'Almond flavoured warm milk' },
    { _id: '14', name: 'Rose Milk',   price: 45, img: '/rose-milk.webp',   desc: 'Sweet rose flavoured milk' },
    { _id: '15', name: 'Mango Lassi', price: 60, img: '/mango-lassi.webp', desc: 'Thick chilled mango yogurt' },
    { _id: '16', name: 'Buttermilk', price: 30,  img: '/Buttermilk.jpg',   desc: 'Salted spiced chaas' },
    { _id: '17', name: 'Fresh Lime',  price: 35, img: '/fresh-lime.webp',  desc: 'Chilled fresh lime soda' },
    { _id: '18', name: 'Milkshake',   price: 70, img: '/Milkshake.webp',   desc: 'Thick creamy flavoured shake' },
  ],
  'Snacks': [
    { _id: '19', name: 'Samosa',       price: 20, img: '/samosa.webp',       desc: 'Crispy fried potato snack' },
    { _id: '20', name: 'Vada Pav',     price: 25, img: '/vada-pav.jpg',      desc: 'Mumbai street style burger' },
    { _id: '21', name: 'Kachori',      price: 20, img: '/Kachori.jpg',       desc: 'Spiced crispy fried bread' },
    { _id: '22', name: 'Bread Pakoda', price: 30, img: '/bread-pakoda.jpg',  desc: 'Stuffed bread in batter' },
    { _id: '23', name: 'Poha',         price: 35, img: '/Poha.jpg',          desc: 'Light flattened rice snack' },
    { _id: '24', name: 'Upma',         price: 35, img: '/Upma.webp',         desc: 'Semolina cooked with veggies' },
  ],
  'Sweets': [
    { _id: '25', name: 'Gulab Jamun', price: 30, img: '/gulab-jamun.jpg', desc: 'Soft milk solids in syrup' },
    { _id: '26', name: 'Halwa',       price: 35, img: '/Halwa.jpg',       desc: 'Rich semolina sweet' },
    { _id: '27', name: 'Jalebi',      price: 25, img: '/Jalebi.webp',     desc: 'Crispy syrup soaked spirals' },
    { _id: '28', name: 'Kheer',       price: 40, img: '/Kheer.jpg',       desc: 'Creamy rice pudding' },
    { _id: '29', name: 'Barfi',       price: 30, img: '/Barfi.jpg',       desc: 'Milk fudge sweet' },
    { _id: '30', name: 'Peda',        price: 20, img: '/Peda.jpg',        desc: 'Sweet condensed milk disc' },
  ],
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Chai & Tea')
  const [menuItems,      setMenuItems]      = useState(FALLBACK)
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    getMenuItems()
      .then((data) => {
        // If DB has items use them, else keep fallback
        const hasItems = Object.values(data).some(arr => arr.length > 0)
        if (hasItems) {
          // normalize img paths
          const normalized = {}
          Object.entries(data).forEach(([cat, items]) => {
            normalized[cat] = items.map(item => ({ ...item, img: imgUrl(item.img) }))
          })
          setMenuItems(normalized)
        }
      })
      .catch(() => { /* backend offline — use fallback */ })
      .finally(() => setLoading(false))
  }, [])

  const currentItems = menuItems[activeCategory] || []

  return (
    <div className="menu-page">

      <div className="menu-hero">
        <h1>Our Menu</h1>
        <p>A delightful range of Chai, Tea, Coffee and more...</p>
      </div>

      <div className="menu-container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="menu-loading">
            <div className="menu-spinner" />
            <p>Loading menu...</p>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && (
          <div className="menu-grid">
            {currentItems.length === 0 ? (
              <p className="menu-empty">No items in this category yet.</p>
            ) : (
              currentItems.map(item => (
                <div className="menu-card" key={item._id}>
                  <div className="menu-card-img">
                    <img src={item.img} alt={item.name} className="menu-item-img" />
                  </div>
                  <div className="menu-card-body">
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                    <div className="menu-card-footer">
                      <span className="menu-price">₹{item.price}</span>
                      <button className="add-btn">+ Add</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Banner */}
      <div className="menu-banner">
        <span>Good Food. Good Mood.</span>
        <img src="/coffee-logo.png" alt="Kalyan Cafe Logo" className="logo-img" />
      </div>
      <div className="menu-star-divider">
        <span>✦</span>
      </div>

    </div>
  )
}
