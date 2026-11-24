import { useEffect, useState } from 'react'
import { CartContext } from './cartStore'

const STORAGE_KEY = 'kalyan-cafe-cart'

function readStoredCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const items = JSON.parse(stored)
    if (!Array.isArray(items)) throw new TypeError('Saved cart must be an array')
    return items
  } catch (error) {
    console.error('Unable to restore the saved cart:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Unable to save the cart:', error)
    }
  }, [items])

  function addItem(product) {
    const id = String(product._id ?? product.id ?? product.name)
    const cartProduct = {
      id,
      name: product.name,
      price: Number(product.price),
      img: product.img,
      desc: product.desc,
      category: product.category ?? '',
    }

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === id)
      if (existing) {
        return currentItems.map((item) => item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
      }
      return [...currentItems, { ...cartProduct, quantity: 1 }]
    })
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id))
      return
    }
    setItems((currentItems) => currentItems.map((item) => item.id === id
      ? { ...item, quantity }
      : item))
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const value = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
