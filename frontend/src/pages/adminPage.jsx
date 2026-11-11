import { useState, useEffect } from 'react'
import {
  adminLogin, verifyToken, uploadHeroImage,
  uploadImage, saveSpecialties, saveWhyUs,
  getHomeContent, imgUrl,
  getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, seedMenu,
  getAllGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  getAllOffers, createOffer, updateOffer, deleteOffer,
  getAboutContent, saveAboutText, uploadAboutCafeImg, uploadAboutFeatureImg, saveAboutFeatures,
  getContactInfo, saveContactInfo, getContactMessages, markMessageRead, deleteMessage,
} from '../services/api'
import '../styles/adminPage.css'

// ── Helpers ───────────────────────────────────────────────────
const TOKEN_KEY = 'kc_admin_token'

export default function AdminPage() {
  const [token,       setToken]       = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [authed,      setAuthed]      = useState(false)
  const [checking,    setChecking]    = useState(true)

  // Login form
  const [username,    setUsername]    = useState('')
  const [password,    setPassword]    = useState('')
  const [loginErr,    setLoginErr]    = useState('')
  const [logging,     setLogging]     = useState(false)

  // Dashboard state
  const [tab,         setTab]         = useState('hero')
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState('')

  // Hero
  const [heroFile,    setHeroFile]    = useState(null)
  const [heroPreview, setHeroPreview] = useState('')
  const [currentHero, setCurrentHero] = useState('')

  // Specialties
  const [specs,       setSpecs]       = useState([])

  // WhyUs
  const [whyUs,       setWhyUs]       = useState([])

  // Menu
  const CATEGORIES = ['Chai & Tea', 'Coffee', 'Special Drinks', 'Snacks', 'Sweets']
  const [menuItems,     setMenuItems]     = useState([])
  const [menuCat,       setMenuCat]       = useState('Chai & Tea')
  const [menuLoading,   setMenuLoading]   = useState(false)
  const [showAddForm,   setShowAddForm]   = useState(false)
  const [editItem,      setEditItem]      = useState(null) // item being edited
  const [newItem,       setNewItem]       = useState({ name: '', category: 'Chai & Tea', price: '', desc: '', image: null, preview: '' })

  // Gallery
  const [galleryItems,    setGalleryItems]    = useState([])
  const [galleryLoading,  setGalleryLoading]  = useState(false)
  const [showGalleryForm, setShowGalleryForm] = useState(false)
  const [editGallery,     setEditGallery]     = useState(null)
  const [newGallery,      setNewGallery]      = useState({ label: '', quote: '', type: 'normal', order: '', image: null, preview: '' })

  // Offers
  const [offerItems,    setOfferItems]    = useState([])
  const [offerLoading,  setOfferLoading]  = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [editOffer,     setEditOffer]     = useState(null)
  const [newOffer,      setNewOffer]      = useState({ tag: '', badge: '', title: '', subtitle: '', desc: '', order: '', image: null, preview: '' })

  // About
  const DEFAULT_ABOUT_FEATURES = [
    { img: '/leaf-image.webp',  title: 'Quality Ingredients' },
    { img: '/heart-image.webp', title: 'Warm Ambiance' },
    { img: '/smile-image.webp', title: 'Happy Customers' },
  ]
  const [aboutData,       setAboutData]       = useState({ subtitle: '', tagline: '', desc1: '', desc2: '', signature: '', cafeImg: '/cafe-1.png' })
  const [aboutFeatures,   setAboutFeatures]   = useState(DEFAULT_ABOUT_FEATURES)
  const [aboutLoading,    setAboutLoading]    = useState(false)
  const [aboutCafeFile,   setAboutCafeFile]   = useState(null)
  const [aboutCafePreview,setAboutCafePreview]= useState('')

  // Contact
  const [contactInfo,    setContactInfo]    = useState({ address: '', phone: '', email: '', hours: '', mapSrc: '', mapLink: '' })
  const [contactMsgs,    setContactMsgs]    = useState([])
  const [contactLoading, setContactLoading] = useState(false)
  const [msgLoading,     setMsgLoading]     = useState(false)

  // ── Auth check on mount ──────────────────────────────────────
  useEffect(() => {
    if (!token) { setChecking(false); return }
    verifyToken(token)
      .then((valid) => {
        setAuthed(valid)
        if (!valid) localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => setChecking(false))
  }, [token])

  // ── Load content when authed ─────────────────────────────────
  useEffect(() => {
    if (!authed) return
    getHomeContent().then((data) => {
      setCurrentHero(imgUrl(data.heroBgImage || 'cafe-home-page.jpeg'))
      if (data.specialties?.length) setSpecs(data.specialties)
      else setSpecs([
        { name: 'Masala Chai',   img: '/masala-tea.webp',    desc: 'Classic spiced brew' },
        { name: 'Ginger Tea',    img: '/ginger-tea.webp',    desc: 'Fresh & zingy' },
        { name: 'Kashmiri Chai', img: '/kashmiri-chai.webp', desc: 'Pink & aromatic' },
        { name: 'Green Tea',     img: '/green-tea.webp',     desc: 'Light & healthy' },
        { name: 'Cafe Coffee',   img: '/cafe-coffee.jpg',    desc: 'Rich & bold' },
        { name: 'Cold Coffee',   img: '/cold-coffee.jpg',    desc: 'Cool & creamy' },
      ])
      if (data.whyUs?.length) setWhyUs(data.whyUs)
      else setWhyUs([
        { img: '/leaf-image.webp',  title: 'Premium Quality Ingredients' },
        { img: '/cafe-coffee.jpg',  title: 'Unique Flavours & Varieties' },
        { img: '/heart-image.webp', title: 'Cozy & Friendly Ambience' },
        { img: '/smile-image.webp', title: 'Great Taste, Always!' },
      ])
    }).catch(() => {})
  }, [authed])

  // ── Load menu items ──────────────────────────────────────────
  useEffect(() => {
    if (!authed) return
    setMenuLoading(true)
    getAllMenuItems(token)
      .then(items => setMenuItems(items))
      .catch(() => {})
      .finally(() => setMenuLoading(false))
  }, [authed])

  function reloadMenu() {
    setMenuLoading(true)
    getAllMenuItems(token)
      .then(items => setMenuItems(items))
      .catch(() => {})
      .finally(() => setMenuLoading(false))
  }
  async function handleLogin(e) {
    e.preventDefault()
    setLoginErr('')
    setLogging(true)
    try {
      const data = await adminLogin(username, password)
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setAuthed(true)
    } catch (err) {
      setLoginErr(err.message)
    } finally {
      setLogging(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setAuthed(false)
  }

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Hero save ────────────────────────────────────────────────
  async function handleHeroSave() {
    if (!heroFile) return flash('Please select an image first')
    setSaving(true)
    try {
      const filename = await uploadHeroImage(token, heroFile)
      setCurrentHero(imgUrl(filename))
      setHeroFile(null)
      setHeroPreview('')
      flash('✅ Hero image updated!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Specialty helpers ─────────────────────────────────────────
  async function handleSpecImg(i, file) {
    if (!file) return
    const preview = URL.createObjectURL(file)
    // Upload to backend
    const filename = await uploadImage(token, 'specialties/upload', file)
    setSpecs(prev => prev.map((s, idx) =>
      idx === i ? { ...s, img: filename, _preview: preview } : s
    ))
  }

  async function handleSpecSave() {
    setSaving(true)
    try {
      await saveSpecialties(token, specs.map(({ _preview, ...s }) => s))
      flash('✅ Specialties saved!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── WhyUs helpers ─────────────────────────────────────────────
  async function handleWhyImg(i, file) {
    if (!file) return
    const preview = URL.createObjectURL(file)
    const filename = await uploadImage(token, 'whyus/upload', file)
    setWhyUs(prev => prev.map((w, idx) =>
      idx === i ? { ...w, img: filename, _preview: preview } : w
    ))
  }

  async function handleWhySave() {
    setSaving(true)
    try {
      await saveWhyUs(token, whyUs.map(({ _preview, ...w }) => w))
      flash('✅ Why Us saved!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Menu handlers ─────────────────────────────────────────────
  async function handleSeedMenu() {
    setSaving(true)
    try {
      const res = await seedMenu(token)
      flash('✅ ' + res.message)
      reloadMenu()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddItem(e) {
    e.preventDefault()
    if (!newItem.image) return flash('Please select an image')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',     newItem.name)
      fd.append('category', newItem.category)
      fd.append('price',    newItem.price)
      fd.append('desc',     newItem.desc)
      fd.append('image',    newItem.image)
      await createMenuItem(token, fd)
      flash('✅ Item added!')
      setNewItem({ name: '', category: 'Chai & Tea', price: '', desc: '', image: null, preview: '' })
      setShowAddForm(false)
      reloadMenu()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateItem(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',      editItem.name)
      fd.append('category',  editItem.category)
      fd.append('price',     editItem.price)
      fd.append('desc',      editItem.desc)
      fd.append('available', editItem.available)
      if (editItem._newImage) fd.append('image', editItem._newImage)
      await updateMenuItem(token, editItem._id, fd)
      flash('✅ Item updated!')
      setEditItem(null)
      reloadMenu()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteItem(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await deleteMenuItem(token, id)
      flash('✅ Deleted!')
      reloadMenu()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  async function handleToggleAvailable(item) {
    try {
      const fd = new FormData()
      fd.append('available', String(!item.available))
      await updateMenuItem(token, item._id, fd)
      reloadMenu()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  // ── Load offers when authed ───────────────────────────────────
  useEffect(() => {
    if (!authed) return
    setOfferLoading(true)
    getAllOffers(token)
      .then(items => setOfferItems(items))
      .catch(() => {})
      .finally(() => setOfferLoading(false))
  }, [authed])

  function reloadOffers() {
    setOfferLoading(true)
    getAllOffers(token)
      .then(items => setOfferItems(items))
      .catch(() => {})
      .finally(() => setOfferLoading(false))
  }

  // ── Offer handlers ────────────────────────────────────────────
  async function handleAddOffer(e) {
    e.preventDefault()
    if (!newOffer.image) return flash('Please select an image')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('tag',      newOffer.tag)
      fd.append('badge',    newOffer.badge)
      fd.append('title',    newOffer.title)
      fd.append('subtitle', newOffer.subtitle)
      fd.append('desc',     newOffer.desc)
      fd.append('order',    newOffer.order || '0')
      fd.append('image',    newOffer.image)
      await createOffer(token, fd)
      flash('✅ Offer added!')
      setNewOffer({ tag: '', badge: '', title: '', subtitle: '', desc: '', order: '', image: null, preview: '' })
      setShowOfferForm(false)
      reloadOffers()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateOffer(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('tag',      editOffer.tag)
      fd.append('badge',    editOffer.badge)
      fd.append('title',    editOffer.title)
      fd.append('subtitle', editOffer.subtitle)
      fd.append('desc',     editOffer.desc)
      fd.append('order',    editOffer.order || '0')
      fd.append('active',   editOffer.active)
      if (editOffer._newImage) fd.append('image', editOffer._newImage)
      await updateOffer(token, editOffer._id, fd)
      flash('✅ Offer updated!')
      setEditOffer(null)
      reloadOffers()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteOffer(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await deleteOffer(token, id)
      flash('✅ Deleted!')
      reloadOffers()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  async function handleToggleOffer(item) {
    try {
      const fd = new FormData()
      fd.append('active', String(!item.active))
      await updateOffer(token, item._id, fd)
      reloadOffers()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  // ── Load about when authed ───────────────────────────────────
  useEffect(() => {
    if (!authed) return
    setAboutLoading(true)
    getAboutContent()
      .then(res => {
        setAboutData({
          subtitle:  res.subtitle  || '',
          tagline:   res.tagline   || '',
          desc1:     res.desc1     || '',
          desc2:     res.desc2     || '',
          signature: res.signature || '',
          cafeImg:   imgUrl(res.cafeImg || 'cafe-1.png'),
        })
        if (res.features?.length) {
          setAboutFeatures(res.features.map(f => ({ ...f, img: imgUrl(f.img) })))
        }
      })
      .catch(() => {})
      .finally(() => setAboutLoading(false))
  }, [authed])

  // ── About handlers ────────────────────────────────────────────
  async function handleAboutTextSave() {
    setSaving(true)
    try {
      await saveAboutText(token, {
        subtitle:  aboutData.subtitle,
        tagline:   aboutData.tagline,
        desc1:     aboutData.desc1,
        desc2:     aboutData.desc2,
        signature: aboutData.signature,
      })
      flash('✅ About text saved!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAboutCafeImgSave() {
    if (!aboutCafeFile) return flash('Please select an image')
    setSaving(true)
    try {
      const filename = await uploadAboutCafeImg(token, aboutCafeFile)
      setAboutData(p => ({ ...p, cafeImg: imgUrl(filename) }))
      setAboutCafeFile(null)
      setAboutCafePreview('')
      flash('✅ Cafe image updated!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAboutFeatureImg(i, file) {
    if (!file) return
    const preview = URL.createObjectURL(file)
    const filename = await uploadAboutFeatureImg(token, file)
    setAboutFeatures(prev => prev.map((f, idx) =>
      idx === i ? { ...f, img: filename, _preview: preview } : f
    ))
  }

  async function handleAboutFeaturesSave() {
    setSaving(true)
    try {
      await saveAboutFeatures(token, aboutFeatures.map(({ _preview, ...f }) => f))
      flash('✅ Features saved!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Load contact when authed ─────────────────────────────────
  useEffect(() => {
    if (!authed) return
    setContactLoading(true)
    getContactInfo()
      .then(data => setContactInfo(data))
      .catch(() => {})
      .finally(() => setContactLoading(false))
  }, [authed])

  function reloadMessages() {
    setMsgLoading(true)
    getContactMessages(token)
      .then(msgs => setContactMsgs(msgs))
      .catch(() => {})
      .finally(() => setMsgLoading(false))
  }

  // ── Contact handlers ──────────────────────────────────────────
  async function handleContactInfoSave() {
    setSaving(true)
    try {
      await saveContactInfo(token, contactInfo)
      flash('✅ Contact info saved!')
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleMarkRead(id) {
    try {
      await markMessageRead(token, id)
      setContactMsgs(prev => prev.map(m => m._id === id ? { ...m, read: true } : m))
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  async function handleDeleteMsg(id) {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteMessage(token, id)
      setContactMsgs(prev => prev.filter(m => m._id !== id))
      flash('✅ Message deleted!')
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  // ── Load gallery when authed ──────────────────────────────────
  useEffect(() => {
    if (!authed) return
    setGalleryLoading(true)
    getAllGalleryItems(token)
      .then(items => setGalleryItems(items))
      .catch(() => {})
      .finally(() => setGalleryLoading(false))
  }, [authed])

  function reloadGallery() {
    setGalleryLoading(true)
    getAllGalleryItems(token)
      .then(items => setGalleryItems(items))
      .catch(() => {})
      .finally(() => setGalleryLoading(false))
  }

  // ── Gallery handlers ──────────────────────────────────────────
  async function handleAddGallery(e) {
    e.preventDefault()
    if (!newGallery.image) return flash('Please select an image')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('label', newGallery.label)
      fd.append('quote', newGallery.quote)
      fd.append('type',  newGallery.type)
      fd.append('order', newGallery.order || '0')
      fd.append('image', newGallery.image)
      await createGalleryItem(token, fd)
      flash('✅ Gallery item added!')
      setNewGallery({ label: '', quote: '', type: 'normal', order: '', image: null, preview: '' })
      setShowGalleryForm(false)
      reloadGallery()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateGallery(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('label',   editGallery.label)
      fd.append('quote',   editGallery.quote)
      fd.append('type',    editGallery.type)
      fd.append('order',   editGallery.order || '0')
      fd.append('visible', editGallery.visible)
      if (editGallery._newImage) fd.append('image', editGallery._newImage)
      await updateGalleryItem(token, editGallery._id, fd)
      flash('✅ Gallery item updated!')
      setEditGallery(null)
      reloadGallery()
    } catch (err) {
      flash('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteGallery(id, label) {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteGalleryItem(token, id)
      flash('✅ Deleted!')
      reloadGallery()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  async function handleToggleGallery(item) {
    try {
      const fd = new FormData()
      fd.append('visible', String(!item.visible))
      await updateGalleryItem(token, item._id, fd)
      reloadGallery()
    } catch (err) {
      flash('❌ ' + err.message)
    }
  }

  // ── Render: checking ─────────────────────────────────────────
  if (checking) {
    return <div className="admin-loading">Checking session...</div>
  }

  // ── Render: Login ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-login-logo">
            <img src="/cafe-logo.jpg" alt="Kalyan Cafe" />
            <h2>Kalyan Cafe</h2>
            <p>Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            {loginErr && <div className="admin-err">{loginErr}</div>}
            <div className="admin-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="admin-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={logging}>
              {logging ? 'Logging in...' : 'Login →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Render: Dashboard ─────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* Topbar */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <img src="/cafe-logo.jpg" alt="logo" className="admin-logo" />
          <span>Kalyan Cafe — Admin</span>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
      </div>

      {/* Flash message */}
      {msg && <div className="admin-flash">{msg}</div>}

      {/* Tabs */}
      <div className="admin-tabs">
        {['hero', 'specialties', 'whyus', 'menu', 'gallery', 'offers', 'about', 'contact'].map(t => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => { setTab(t); if (t === 'contact') reloadMessages() }}
          >
            {t === 'hero'        ? '🖼 Hero'
              : t === 'specialties' ? '☕ Specialties'
              : t === 'whyus'       ? '✨ Why Us'
              : t === 'menu'        ? '🍽 Menu'
              : t === 'gallery'     ? '🖼️ Gallery'
              : t === 'offers'      ? '🏷️ Offers'
              : t === 'about'       ? '📖 About'
              :                       '📬 Contact'}
          </button>
        ))}
      </div>

      <div className="admin-body">

        {/* ── HERO TAB ── */}
        {tab === 'hero' && (
          <div className="admin-section">
            <h3>Hero Background Image</h3>
            <p className="admin-hint">This image appears as the full background on the Home page hero section.</p>

            <div className="hero-preview-wrap">
              <img src={heroPreview || currentHero} alt="Hero Preview" className="hero-preview-img" />
              <span className="hero-preview-label">Current Hero</span>
            </div>

            <label className="admin-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const f = e.target.files[0]
                  if (f) {
                    setHeroFile(f)
                    setHeroPreview(URL.createObjectURL(f))
                  }
                }}
              />
              Choose New Image
            </label>

            <button
              className="admin-save-btn"
              onClick={handleHeroSave}
              disabled={saving || !heroFile}
            >
              {saving ? 'Saving...' : 'Save Hero Image'}
            </button>
          </div>
        )}

        {/* ── SPECIALTIES TAB ── */}
        {tab === 'specialties' && (
          <div className="admin-section">
            <h3>Our Specialties</h3>
            <p className="admin-hint">Update names, descriptions and images for each specialty item.</p>

            <div className="admin-cards-grid">
              {specs.map((s, i) => (
                <div className="admin-card" key={i}>
                  <div className="admin-card-img-wrap">
                    <img src={s._preview || imgUrl(s.img)} alt={s.name} />
                    <label className="admin-img-change">
                      <input type="file" accept="image/*"
                        onChange={e => handleSpecImg(i, e.target.files[0])} />
                      📷 Change
                    </label>
                  </div>
                  <input
                    className="admin-input"
                    value={s.name}
                    placeholder="Name"
                    onChange={e => setSpecs(prev => prev.map((x, idx) =>
                      idx === i ? { ...x, name: e.target.value } : x))}
                  />
                  <input
                    className="admin-input"
                    value={s.desc}
                    placeholder="Description"
                    onChange={e => setSpecs(prev => prev.map((x, idx) =>
                      idx === i ? { ...x, desc: e.target.value } : x))}
                  />
                </div>
              ))}
            </div>

            <button className="admin-save-btn" onClick={handleSpecSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Specialties'}
            </button>
          </div>
        )}

        {/* ── WHY US TAB ── */}
        {tab === 'whyus' && (
          <div className="admin-section">
            <h3>Why Choose Us</h3>
            <p className="admin-hint">Update images and titles for the 4 feature cards.</p>

            <div className="admin-cards-grid">
              {whyUs.map((w, i) => (
                <div className="admin-card" key={i}>
                  <div className="admin-card-img-wrap">
                    <img src={w._preview || imgUrl(w.img)} alt={w.title} />
                    <label className="admin-img-change">
                      <input type="file" accept="image/*"
                        onChange={e => handleWhyImg(i, e.target.files[0])} />
                      📷 Change
                    </label>
                  </div>
                  <input
                    className="admin-input"
                    value={w.title}
                    placeholder="Title"
                    onChange={e => setWhyUs(prev => prev.map((x, idx) =>
                      idx === i ? { ...x, title: e.target.value } : x))}
                  />
                </div>
              ))}
            </div>

            <button className="admin-save-btn" onClick={handleWhySave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Why Us'}
            </button>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === 'menu' && (
          <div className="admin-section">
            <div className="menu-admin-header">
              <div>
                <h3>🍽 Menu Items</h3>
                <p className="admin-hint">Add, edit, delete menu items. Toggle availability anytime.</p>
              </div>
              <div className="menu-admin-actions">
                <button className="admin-seed-btn" onClick={handleSeedMenu} disabled={saving}>
                  ⚡ Seed Defaults
                </button>
                <button className="admin-add-btn" onClick={() => { setShowAddForm(v => !v); setEditItem(null) }}>
                  {showAddForm ? '✕ Cancel' : '+ Add Item'}
                </button>
              </div>
            </div>

            {/* Add form */}
            {showAddForm && (
              <form className="menu-item-form" onSubmit={handleAddItem}>
                <h4>New Menu Item</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Name *</label>
                    <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Masala Chai" required />
                  </div>
                  <div className="admin-field">
                    <label>Category *</label>
                    <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Price (₹) *</label>
                    <input type="number" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} placeholder="30" required />
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <input value={newItem.desc} onChange={e => setNewItem(p => ({ ...p, desc: e.target.value }))} placeholder="Short description" />
                  </div>
                  <div className="admin-field">
                    <label>Image *</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setNewItem(p => ({ ...p, image: f, preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose Image
                    </label>
                    {newItem.preview && <img src={newItem.preview} alt="preview" className="form-img-preview" />}
                  </div>
                </div>
                <button type="submit" className="admin-save-btn" style={{ marginTop: 16 }} disabled={saving}>
                  {saving ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            )}

            {/* Edit form */}
            {editItem && (
              <form className="menu-item-form" onSubmit={handleUpdateItem}>
                <h4>Edit: {editItem.name}</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Name</label>
                    <input value={editItem.name} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <select value={editItem.category} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Price (₹)</label>
                    <input type="number" value={editItem.price} onChange={e => setEditItem(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <input value={editItem.desc} onChange={e => setEditItem(p => ({ ...p, desc: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Change Image (optional)</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setEditItem(p => ({ ...p, _newImage: f, _preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose Image
                    </label>
                    {(editItem._preview || editItem.img) && (
                      <img src={editItem._preview || imgUrl(editItem.img)} alt="preview" className="form-img-preview" />
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="admin-save-btn" style={{ marginTop: 0 }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setEditItem(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Category filter tabs */}
            <div className="menu-cat-tabs">
              <button className={`menu-cat-tab ${menuCat === 'All' ? 'active' : ''}`} onClick={() => setMenuCat('All')}>All</button>
              {CATEGORIES.map(c => (
                <button key={c} className={`menu-cat-tab ${menuCat === c ? 'active' : ''}`} onClick={() => setMenuCat(c)}>{c}</button>
              ))}
            </div>

            {/* Items table */}
            {menuLoading ? (
              <div className="menu-loading"><div className="menu-spinner" /><p>Loading...</p></div>
            ) : (
              <div className="menu-items-table">
                {(menuCat === 'All' ? menuItems : menuItems.filter(i => i.category === menuCat)).length === 0 ? (
                  <p className="menu-empty">No items yet. Click "Seed Defaults" or "Add Item".</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(menuCat === 'All' ? menuItems : menuItems.filter(i => i.category === menuCat)).map(item => (
                        <tr key={item._id} className={!item.available ? 'row-unavailable' : ''}>
                          <td>
                            <img src={imgUrl(item.img)} alt={item.name} className="table-item-img" />
                          </td>
                          <td>
                            <strong>{item.name}</strong>
                            <br /><span className="table-desc">{item.desc}</span>
                          </td>
                          <td><span className="table-cat-badge">{item.category}</span></td>
                          <td><strong>₹{item.price}</strong></td>
                          <td>
                            <button
                              className={`toggle-btn ${item.available ? 'available' : 'unavailable'}`}
                              onClick={() => handleToggleAvailable(item)}
                            >
                              {item.available ? '✅ Available' : '❌ Hidden'}
                            </button>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="edit-btn" onClick={() => { setEditItem({ ...item }); setShowAddForm(false) }}>✏️ Edit</button>
                              <button className="delete-btn" onClick={() => handleDeleteItem(item._id, item.name)}>🗑 Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {tab === 'gallery' && (
          <div className="admin-section">
            <div className="menu-admin-header">
              <div>
                <h3>🖼️ Gallery Images</h3>
                <p className="admin-hint">Add, edit, delete gallery images with labels and quotes.</p>
              </div>
              <button className="admin-add-btn" onClick={() => { setShowGalleryForm(v => !v); setEditGallery(null) }}>
                {showGalleryForm ? '✕ Cancel' : '+ Add Photo'}
              </button>
            </div>

            {/* Add form */}
            {showGalleryForm && (
              <form className="menu-item-form" onSubmit={handleAddGallery}>
                <h4>New Gallery Photo</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Label *</label>
                    <input value={newGallery.label} onChange={e => setNewGallery(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Our Cozy Space" required />
                  </div>
                  <div className="admin-field">
                    <label>Quote / Description</label>
                    <input value={newGallery.quote} onChange={e => setNewGallery(p => ({ ...p, quote: e.target.value }))} placeholder="e.g. Where every corner tells a story ☕" />
                  </div>
                  <div className="admin-field">
                    <label>Type</label>
                    <select value={newGallery.type} onChange={e => setNewGallery(p => ({ ...p, type: e.target.value }))}>
                      <option value="normal">Normal</option>
                      <option value="wide">Wide (2 columns)</option>
                      <option value="tall">Tall (2 rows)</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Order (sort position)</label>
                    <input type="number" value={newGallery.order} onChange={e => setNewGallery(p => ({ ...p, order: e.target.value }))} placeholder="1" />
                  </div>
                  <div className="admin-field">
                    <label>Image *</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setNewGallery(p => ({ ...p, image: f, preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose Image
                    </label>
                    {newGallery.preview && <img src={newGallery.preview} alt="preview" className="form-img-preview" />}
                  </div>
                </div>
                <button type="submit" className="admin-save-btn" style={{ marginTop: 16 }} disabled={saving}>
                  {saving ? 'Adding...' : 'Add Photo'}
                </button>
              </form>
            )}

            {/* Edit form */}
            {editGallery && (
              <form className="menu-item-form" onSubmit={handleUpdateGallery}>
                <h4>Edit: {editGallery.label}</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Label</label>
                    <input value={editGallery.label} onChange={e => setEditGallery(p => ({ ...p, label: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>Quote / Description</label>
                    <input value={editGallery.quote} onChange={e => setEditGallery(p => ({ ...p, quote: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Type</label>
                    <select value={editGallery.type} onChange={e => setEditGallery(p => ({ ...p, type: e.target.value }))}>
                      <option value="normal">Normal</option>
                      <option value="wide">Wide</option>
                      <option value="tall">Tall</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Order</label>
                    <input type="number" value={editGallery.order} onChange={e => setEditGallery(p => ({ ...p, order: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Change Image (optional)</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setEditGallery(p => ({ ...p, _newImage: f, _preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose Image
                    </label>
                    {(editGallery._preview || editGallery.img) && (
                      <img src={editGallery._preview || imgUrl(editGallery.img)} alt="preview" className="form-img-preview" />
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="admin-save-btn" style={{ marginTop: 0 }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setEditGallery(null)}>Cancel</button>
                </div>
              </form>
            )}

            {/* Gallery grid preview + table */}
            {galleryLoading ? (
              <div className="menu-loading"><div className="menu-spinner" /><p>Loading...</p></div>
            ) : galleryItems.length === 0 ? (
              <p className="menu-empty">No gallery items yet. Click "+ Add Photo".</p>
            ) : (
              <>
                {/* Visual grid preview */}
                <div className="gallery-admin-grid">
                  {galleryItems.map(item => (
                    <div className={`gallery-admin-card ${!item.visible ? 'hidden-card' : ''}`} key={item._id}>
                      <div className="gallery-admin-img">
                        <img src={imgUrl(item.img)} alt={item.label} />
                        <span className="gallery-type-badge">{item.type}</span>
                        {!item.visible && <span className="gallery-hidden-badge">Hidden</span>}
                      </div>
                      <div className="gallery-admin-info">
                        <p className="gallery-admin-label">{item.label}</p>
                        {item.quote && <p className="gallery-admin-quote">"{item.quote}"</p>}
                      </div>
                      <div className="gallery-admin-actions">
                        <button
                          className={`toggle-btn ${item.visible ? 'available' : 'unavailable'}`}
                          onClick={() => handleToggleGallery(item)}
                        >
                          {item.visible ? '👁 Visible' : '🙈 Hidden'}
                        </button>
                        <button className="edit-btn" onClick={() => { setEditGallery({ ...item }); setShowGalleryForm(false) }}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteGallery(item._id, item.label)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OFFERS TAB ── */}
        {tab === 'offers' && (
          <div className="admin-section">
            <div className="menu-admin-header">
              <div>
                <h3>🏷️ Special Offers</h3>
                <p className="admin-hint">Add, edit, delete offers. Toggle active/inactive anytime.</p>
              </div>
              <button className="admin-add-btn" onClick={() => { setShowOfferForm(v => !v); setEditOffer(null) }}>
                {showOfferForm ? '✕ Cancel' : '+ Add Offer'}
              </button>
            </div>

            {/* Add form */}
            {showOfferForm && (
              <form className="menu-item-form" onSubmit={handleAddOffer}>
                <h4>New Offer</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Title *</label>
                    <input value={newOffer.title} onChange={e => setNewOffer(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Buy 1 Get 1 Free" required />
                  </div>
                  <div className="admin-field">
                    <label>Subtitle</label>
                    <input value={newOffer.subtitle} onChange={e => setNewOffer(p => ({ ...p, subtitle: e.target.value }))} placeholder="e.g. on Chai" />
                  </div>
                  <div className="admin-field">
                    <label>Tag (label top-left)</label>
                    <input value={newOffer.tag} onChange={e => setNewOffer(p => ({ ...p, tag: e.target.value }))} placeholder="e.g. Best Deal" />
                  </div>
                  <div className="admin-field">
                    <label>Badge (highlight top-right)</label>
                    <input value={newOffer.badge} onChange={e => setNewOffer(p => ({ ...p, badge: e.target.value }))} placeholder="e.g. B1G1 or 20%" />
                  </div>
                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <input value={newOffer.desc} onChange={e => setNewOffer(p => ({ ...p, desc: e.target.value }))} placeholder="Offer details..." />
                  </div>
                  <div className="admin-field">
                    <label>Order</label>
                    <input type="number" value={newOffer.order} onChange={e => setNewOffer(p => ({ ...p, order: e.target.value }))} placeholder="1" />
                  </div>
                  <div className="admin-field">
                    <label>Image *</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setNewOffer(p => ({ ...p, image: f, preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose Image
                    </label>
                    {newOffer.preview && <img src={newOffer.preview} alt="preview" className="form-img-preview" />}
                  </div>
                </div>
                <button type="submit" className="admin-save-btn" style={{ marginTop: 16 }} disabled={saving}>
                  {saving ? 'Adding...' : 'Add Offer'}
                </button>
              </form>
            )}

            {/* Edit form */}
            {editOffer && (
              <form className="menu-item-form" onSubmit={handleUpdateOffer}>
                <h4>Edit: {editOffer.title}</h4>
                <div className="menu-form-grid">
                  <div className="admin-field">
                    <label>Title</label>
                    <input value={editOffer.title} onChange={e => setEditOffer(p => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>Subtitle</label>
                    <input value={editOffer.subtitle} onChange={e => setEditOffer(p => ({ ...p, subtitle: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Tag</label>
                    <input value={editOffer.tag} onChange={e => setEditOffer(p => ({ ...p, tag: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Badge</label>
                    <input value={editOffer.badge} onChange={e => setEditOffer(p => ({ ...p, badge: e.target.value }))} />
                  </div>
                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <input value={editOffer.desc} onChange={e => setEditOffer(p => ({ ...p, desc: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label>Change Image (optional)</label>
                    <label className="admin-upload-label" style={{ marginBottom: 0 }}>
                      <input type="file" accept="image/*" onChange={e => {
                        const f = e.target.files[0]
                        if (f) setEditOffer(p => ({ ...p, _newImage: f, _preview: URL.createObjectURL(f) }))
                      }} />
                      📷 Choose
                    </label>
                    {(editOffer._preview || editOffer.img) && (
                      <img src={editOffer._preview || imgUrl(editOffer.img)} alt="preview" className="form-img-preview" />
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="admin-save-btn" style={{ marginTop: 0 }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setEditOffer(null)}>Cancel</button>
                </div>
              </form>
            )}

            {/* Offers grid */}
            {offerLoading ? (
              <div className="menu-loading"><div className="menu-spinner" /><p>Loading...</p></div>
            ) : offerItems.length === 0 ? (
              <p className="menu-empty">No offers yet. Click "+ Add Offer".</p>
            ) : (
              <div className="offers-admin-grid">
                {offerItems.map(offer => (
                  <div className={`offers-admin-card ${!offer.active ? 'hidden-card' : ''}`} key={offer._id}>
                    <div className="offers-admin-img">
                      <img src={imgUrl(offer.img)} alt={offer.title} />
                      <span className="offer-admin-badge">{offer.badge}</span>
                      {!offer.active && <span className="gallery-hidden-badge">Inactive</span>}
                    </div>
                    <div className="offers-admin-info">
                      <span className="offer-admin-tag">{offer.tag}</span>
                      <p className="offers-admin-title">{offer.title}</p>
                      <p className="offers-admin-sub">{offer.subtitle}</p>
                      <p className="offers-admin-desc">{offer.desc}</p>
                    </div>
                    <div className="gallery-admin-actions">
                      <button
                        className={`toggle-btn ${offer.active ? 'available' : 'unavailable'}`}
                        onClick={() => handleToggleOffer(offer)}
                      >
                        {offer.active ? '✅ Active' : '❌ Inactive'}
                      </button>
                      <button className="edit-btn" onClick={() => { setEditOffer({ ...offer }); setShowOfferForm(false) }}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteOffer(offer._id, offer.title)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {tab === 'about' && (
          <div className="admin-section">
            <h3>📖 About Page</h3>
            <p className="admin-hint">Edit text content, cafe image, and feature cards for the About page.</p>

            {aboutLoading ? (
              <div className="menu-loading"><div className="menu-spinner" /><p>Loading...</p></div>
            ) : (
              <>
                {/* ── Cafe Image (right side) ── */}
                <div className="about-admin-block">
                  <h4>Cafe Image <span>(Right side photo)</span></h4>
                  <div className="about-admin-img-row">
                    <img
                      src={aboutCafePreview || aboutData.cafeImg}
                      alt="Cafe"
                      className="about-admin-preview"
                    />
                    <div>
                      <label className="admin-upload-label">
                        <input type="file" accept="image/*" onChange={e => {
                          const f = e.target.files[0]
                          if (f) { setAboutCafeFile(f); setAboutCafePreview(URL.createObjectURL(f)) }
                        }} />
                        📷 Choose Image
                      </label>
                      <button
                        className="admin-save-btn"
                        style={{ marginTop: 12, display: 'block' }}
                        onClick={handleAboutCafeImgSave}
                        disabled={saving || !aboutCafeFile}
                      >
                        {saving ? 'Saving...' : 'Save Image'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Text Fields ── */}
                <div className="about-admin-block">
                  <h4>Text Content</h4>
                  <div className="about-text-grid">
                    <div className="admin-field">
                      <label>Subtitle (top line)</label>
                      <input
                        value={aboutData.subtitle}
                        onChange={e => setAboutData(p => ({ ...p, subtitle: e.target.value }))}
                        placeholder="More than just a cafe..."
                      />
                    </div>
                    <div className="admin-field">
                      <label>Tagline (below title)</label>
                      <input
                        value={aboutData.tagline}
                        onChange={e => setAboutData(p => ({ ...p, tagline: e.target.value }))}
                        placeholder="It's a feeling!"
                      />
                    </div>
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Description 1</label>
                      <textarea
                        rows={3}
                        value={aboutData.desc1}
                        onChange={e => setAboutData(p => ({ ...p, desc1: e.target.value }))}
                        placeholder="First paragraph..."
                        className="admin-textarea"
                      />
                    </div>
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Description 2</label>
                      <textarea
                        rows={3}
                        value={aboutData.desc2}
                        onChange={e => setAboutData(p => ({ ...p, desc2: e.target.value }))}
                        placeholder="Second paragraph..."
                        className="admin-textarea"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Signature</label>
                      <input
                        value={aboutData.signature}
                        onChange={e => setAboutData(p => ({ ...p, signature: e.target.value }))}
                        placeholder="— Kalyan Cafe ❤️"
                      />
                    </div>
                  </div>
                  <button className="admin-save-btn" onClick={handleAboutTextSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Text'}
                  </button>
                </div>

                {/* ── Feature Cards ── */}
                <div className="about-admin-block">
                  <h4>Feature Cards <span>(3 icons at bottom)</span></h4>
                  <div className="about-features-grid">
                    {aboutFeatures.map((f, i) => (
                      <div className="about-feature-card" key={i}>
                        <div className="about-feature-img-wrap">
                          <img src={f._preview || imgUrl(f.img)} alt={f.title} />
                          <label className="admin-img-change">
                            <input type="file" accept="image/*"
                              onChange={e => handleAboutFeatureImg(i, e.target.files[0])} />
                            📷 Change
                          </label>
                        </div>
                        <input
                          className="admin-input"
                          value={f.title}
                          placeholder="Feature title"
                          onChange={e => setAboutFeatures(prev =>
                            prev.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="admin-save-btn" onClick={handleAboutFeaturesSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Features'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── CONTACT TAB ── */}
        {tab === 'contact' && (
          <div className="admin-section">
            <h3>📬 Contact Page</h3>
            <p className="admin-hint">Edit contact details and view messages sent by customers.</p>

            {contactLoading ? (
              <div className="menu-loading"><div className="menu-spinner" /><p>Loading...</p></div>
            ) : (
              <>
                {/* ── Contact Info Edit ── */}
                <div className="about-admin-block">
                  <h4>Contact Details</h4>
                  <div className="contact-info-grid">
                    <div className="admin-field">
                      <label>📍 Address</label>
                      <input
                        value={contactInfo.address}
                        onChange={e => setContactInfo(p => ({ ...p, address: e.target.value }))}
                        placeholder="Kalyan Cafe, Rangapuram, Telangana"
                      />
                    </div>
                    <div className="admin-field">
                      <label>📞 Phone</label>
                      <input
                        value={contactInfo.phone}
                        onChange={e => setContactInfo(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="admin-field">
                      <label>📧 Email</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={e => setContactInfo(p => ({ ...p, email: e.target.value }))}
                        placeholder="hello@klyancafe.in"
                      />
                    </div>
                    <div className="admin-field">
                      <label>🕐 Opening Hours</label>
                      <input
                        value={contactInfo.hours}
                        onChange={e => setContactInfo(p => ({ ...p, hours: e.target.value }))}
                        placeholder="Mon – Sun: 8 AM – 11 PM"
                      />
                    </div>
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>🗺 Google Maps Embed URL (iframe src)</label>
                      <input
                        value={contactInfo.mapSrc}
                        onChange={e => setContactInfo(p => ({ ...p, mapSrc: e.target.value }))}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                      />
                    </div>
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>🔗 Google Maps Click Link</label>
                      <input
                        value={contactInfo.mapLink}
                        onChange={e => setContactInfo(p => ({ ...p, mapLink: e.target.value }))}
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>
                  </div>
                  <button className="admin-save-btn" onClick={handleContactInfoSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Contact Info'}
                  </button>
                </div>

                {/* ── Messages Inbox ── */}
                <div className="about-admin-block">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h4 style={{ marginBottom: 0 }}>
                      📩 Customer Messages
                      {contactMsgs.filter(m => !m.read).length > 0 && (
                        <span className="unread-badge">
                          {contactMsgs.filter(m => !m.read).length} new
                        </span>
                      )}
                    </h4>
                    <button className="admin-seed-btn" onClick={reloadMessages} disabled={msgLoading}>
                      {msgLoading ? 'Loading...' : '🔄 Refresh'}
                    </button>
                  </div>

                  {msgLoading ? (
                    <div className="menu-loading"><div className="menu-spinner" /></div>
                  ) : contactMsgs.length === 0 ? (
                    <p className="menu-empty">No messages yet.</p>
                  ) : (
                    <div className="messages-list">
                      {contactMsgs.map(msg => (
                        <div
                          className={`message-card ${!msg.read ? 'msg-unread' : ''}`}
                          key={msg._id}
                        >
                          <div className="msg-header">
                            <div className="msg-sender">
                              <span className="msg-name">{msg.name}</span>
                              <span className="msg-email">{msg.email}</span>
                            </div>
                            <div className="msg-meta">
                              <span className="msg-time">
                                {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              {!msg.read && <span className="msg-new-badge">New</span>}
                            </div>
                          </div>
                          <p className="msg-text">{msg.message}</p>
                          <div className="msg-actions">
                            {!msg.read && (
                              <button className="edit-btn" onClick={() => handleMarkRead(msg._id)}>
                                ✅ Mark as Read
                              </button>
                            )}
                            <button className="delete-btn" onClick={() => handleDeleteMsg(msg._id)}>
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
