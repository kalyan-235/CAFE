import { Link } from 'react-router-dom'
import { useCart } from '../context/cartStore'
import '../styles/cartPage.css'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <div className="cart-page">
      <header className="cart-hero">
        <h1>Your Cart</h1>
        <p>Review your items before placing your order</p>
      </header>

      <div className="cart-container">
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon" aria-hidden="true">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add coffee, chai, or snacks from the menu to get started.</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              <div className="cart-items-heading">
                <h2>Items ({itemCount})</h2>
                <button type="button" className="cart-clear-btn" onClick={clearCart}>
                  Clear cart
                </button>
              </div>

              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img className="cart-item-image" src={item.img} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    {item.category && <p className="cart-item-category">{item.category}</p>}
                    <p className="cart-item-price">{currency.format(item.price)} each</p>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-quantity" aria-label={`${item.name} quantity`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <strong>{currency.format(item.price * item.quantity)}</strong>
                  </div>
                </article>
              ))}

              <Link to="/menu" className="cart-continue-link">← Continue shopping</Link>
            </section>

            <aside className="cart-summary">
              <div className="cart-summary-inner">
                <h2>Order Summary</h2>
                <div className="cart-summary-line">
                  <span>Items ({itemCount})</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <strong>{currency.format(subtotal)}</strong>
                </div>
                <p className="cart-summary-note">Taxes and any applicable charges are confirmed at the cafe.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
