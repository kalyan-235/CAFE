const BASE_URL = import.meta.env.VITE_API_URL || 'https://cafe-backend-c7bk.onrender.com'

// ── Image URL helper ──────────────────────────────────────────
// If filename starts with "/" it's a local public/ asset
// Otherwise it came from backend uploads/
export function imgUrl(filename) {
  if (!filename) return ''
  if (filename.startsWith('/') || filename.startsWith('http')) return filename

  // All public folder static assets
  const publicAssets = [
    'cafe-home-page.jpeg','cafe-1.png','cafe-2.png','cafe-logo.jpg','cafe-logo2.jpg',
    'coffee-logo.png','coffe-logo.webp',
    // Chai & Tea
    'masala-tea.webp','ginger-tea.webp','kashmiri-chai.webp','green-tea.webp',
    'lemon-tea.jpg','elaichi-chai.jpg',
    // Coffee
    'cafe-coffee.jpg','cold-coffee.jpg','filter-coffee.jpg',
    'cappuccino.jpg','latte.jpg','Mocha.jpg',
    // Special Drinks
    'badam-milk.jpg','rose-milk.webp','mango-lassi.webp',
    'Buttermilk.jpg','fresh-lime.webp','Milkshake.webp',
    // Snacks
    'samosa.webp','vada-pav.jpg','Kachori.jpg',
    'bread-pakoda.jpg','Poha.jpg','Upma.webp',
    // Sweets
    'gulab-jamun.jpg','Halwa.jpg','Jalebi.webp',
    'Kheer.jpg','Barfi.jpg','Peda.jpg',
    // Why Us / icons
    'leaf-image.webp','heart-image.webp','smile-image.webp',
    // Gallery
    'gallery-1.jpeg','gallery-2.jpeg','gallery-3.jpeg','gallery-4.jpeg',
  ]

  if (publicAssets.includes(filename)) return `/${filename}`
  // Otherwise served from backend uploads/
  return `${BASE_URL}/uploads/${filename}`
}

// ── Public API ────────────────────────────────────────────────
export async function getHomeContent() {
  const res = await fetch(`${BASE_URL}/api/content`)
  if (!res.ok) throw new Error('Failed to fetch content')
  return res.json()
}

// ── Admin Auth ────────────────────────────────────────────────
export async function adminLogin(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  return data // { token, username }
}

export async function verifyToken(token) {
  const res = await fetch(`${BASE_URL}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.ok
}

// ── Admin Content APIs ────────────────────────────────────────
function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

// Upload image → returns filename
export async function uploadImage(token, endpoint, file) {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${BASE_URL}/api/content/${endpoint}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.filename
}

// Upload hero image → returns filename
export async function uploadHeroImage(token, file) {
  const form = new FormData()
  form.append('heroImage', file)
  const res = await fetch(`${BASE_URL}/api/content/hero`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.heroBgImage
}

// Save specialties array
export async function saveSpecialties(token, specialties) {
  const res = await fetch(`${BASE_URL}/api/content/specialties`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ specialties }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.specialties
}

// Save whyUs array
export async function saveWhyUs(token, whyUs) {
  const res = await fetch(`${BASE_URL}/api/content/whyus`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ whyUs }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.whyUs
}

// ── Menu APIs ─────────────────────────────────────────────────

// Public — grouped by category
export async function getMenuItems() {
  const res = await fetch(`${BASE_URL}/api/menu`)
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json() // { 'Chai & Tea': [...], 'Coffee': [...], ... }
}

// Admin — all items flat list
export async function getAllMenuItems(token) {
  const res = await fetch(`${BASE_URL}/api/menu/all`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}

// Create menu item (FormData with image)
export async function createMenuItem(token, formData) {
  const res = await fetch(`${BASE_URL}/api/menu`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Update menu item
export async function updateMenuItem(token, id, formData) {
  const res = await fetch(`${BASE_URL}/api/menu/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Delete menu item
export async function deleteMenuItem(token, id) {
  const res = await fetch(`${BASE_URL}/api/menu/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Seed default menu items
export async function seedMenu(token) {
  const res = await fetch(`${BASE_URL}/api/menu/seed`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ── Gallery APIs ──────────────────────────────────────────────

// Public — visible items
export async function getGalleryItems() {
  const res = await fetch(`${BASE_URL}/api/gallery`)
  if (!res.ok) throw new Error('Failed to fetch gallery')
  return res.json()
}

// Admin — all items
export async function getAllGalleryItems(token) {
  const res = await fetch(`${BASE_URL}/api/gallery/all`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to fetch gallery')
  return res.json()
}

// Add gallery item
export async function createGalleryItem(token, formData) {
  const res = await fetch(`${BASE_URL}/api/gallery`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Update gallery item
export async function updateGalleryItem(token, id, formData) {
  const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Delete gallery item
export async function deleteGalleryItem(token, id) {
  const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ── Offers APIs ───────────────────────────────────────────────

// Public — active offers
export async function getOffers() {
  const res = await fetch(`${BASE_URL}/api/offers`)
  if (!res.ok) throw new Error('Failed to fetch offers')
  return res.json()
}

// Admin — all offers
export async function getAllOffers(token) {
  const res = await fetch(`${BASE_URL}/api/offers/all`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to fetch offers')
  return res.json()
}

// Create offer
export async function createOffer(token, formData) {
  const res = await fetch(`${BASE_URL}/api/offers`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Update offer
export async function updateOffer(token, id, formData) {
  const res = await fetch(`${BASE_URL}/api/offers/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// Delete offer
export async function deleteOffer(token, id) {
  const res = await fetch(`${BASE_URL}/api/offers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ── About Page APIs (separate /api/about) ────────────────────

export async function getAboutContent() {
  const res = await fetch(`${BASE_URL}/api/about`)
  if (!res.ok) throw new Error('Failed to fetch about content')
  return res.json()
}

export async function saveAboutText(token, data) {
  const res = await fetch(`${BASE_URL}/api/about/text`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message)
  return json
}

export async function uploadAboutCafeImg(token, file) {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetch(`${BASE_URL}/api/about/cafe-image`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.cafeImg
}

export async function uploadAboutFeatureImg(token, file) {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetch(`${BASE_URL}/api/about/features/upload`, {
    method: 'POST',
    headers: authHeaders(token),
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.filename
}

export async function saveAboutFeatures(token, features) {
  const res = await fetch(`${BASE_URL}/api/about/features`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.features
}


// ── Contact APIs ──────────────────────────────────────────────

export async function getContactInfo() {
  const res = await fetch(`${BASE_URL}/api/contact/info`)
  if (!res.ok) throw new Error('Failed to fetch contact info')
  return res.json()
}

export async function submitContactMessage(data) {
  const res = await fetch(`${BASE_URL}/api/contact/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message)
  return json
}

export async function saveContactInfo(token, data) {
  const res = await fetch(`${BASE_URL}/api/contact/info`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message)
  return json
}

export async function getContactMessages(token) {
  const res = await fetch(`${BASE_URL}/api/contact/messages`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

export async function markMessageRead(token, id) {
  const res = await fetch(`${BASE_URL}/api/contact/messages/${id}/read`, {
    method: 'PUT',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function deleteMessage(token, id) {
  const res = await fetch(`${BASE_URL}/api/contact/messages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
