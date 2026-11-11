import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAboutContent, imgUrl } from '../services/api'
import '../styles/aboutPage.css'

const DEFAULT_FEATURES = [
  { img: '/leaf-image.webp',  title: 'Quality Ingredients' },
  { img: '/heart-image.webp', title: 'Warm Ambiance' },
  { img: '/smile-image.webp', title: 'Happy Customers' },
]

const DEFAULT = {
  cafeImg:   '/cafe-1.png',
  subtitle:  'More than just a cafe...',
  tagline:   "It's a feeling!",
  desc1:     'At Kalyan Cafe, we believe in the simple joys of life — a hot cup of chai, a great conversation, and a cozy spot to sit. Our journey started with a passion for tea and a dream to bring happiness in every sip.',
  desc2:     'We serve a variety of chai, tea, coffee and snacks, made with premium ingredients and a lot of love.',
  signature: '— Kalyan Cafe ❤️',
  features:  DEFAULT_FEATURES,
}

export default function AboutPage() {
  const [data,    setData]    = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAboutContent()
      .then((res) => {
        setData({
          cafeImg:   imgUrl(res.cafeImg   || 'cafe-1.png'),
          subtitle:  res.subtitle  || DEFAULT.subtitle,
          tagline:   res.tagline   || DEFAULT.tagline,
          desc1:     res.desc1     || DEFAULT.desc1,
          desc2:     res.desc2     || DEFAULT.desc2,
          signature: res.signature || DEFAULT.signature,
          features:  res.features?.length
            ? res.features.map(f => ({ ...f, img: imgUrl(f.img) }))
            : DEFAULT_FEATURES,
        })
      })
      .catch(() => {/* use defaults */})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="about-page">
        <div className="about-hero">
          <h1>About Us</h1>
          <p>More than just a cafe... It's a feeling!</p>
        </div>
        <div className="about-loading">
          <div className="about-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>More than just a cafe... It's a feeling!</p>
      </div>

      {/* MAIN */}
      <div className="about-container">

        {/* LEFT */}
        <div className="about-left">
          <p className="about-sub">{data.subtitle}</p>
          <h2 className="about-title">
            About <span>Kalyan Cafe</span>
          </h2>
          <p className="about-tagline">{data.tagline}</p>

          <div className="about-divider"><span /><span /></div>

          <p className="about-desc">{data.desc1}</p>
          <p className="about-desc">{data.desc2}</p>

          <p className="about-signature">{data.signature}</p>

          {/* Features */}
          <div className="about-features">
            {data.features.map((f, i) => (
              <div className="about-feature" key={i}>
                <div className="about-feature-icon">
                  <img src={f.img} alt={f.title} />
                </div>
                <p>{f.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="about-right">
          <div className="about-img-wrap">
            <img src={data.cafeImg} alt="Kalyan Cafe" className="about-cafe-img" />
            <div className="about-img-badge">
              <span className="about-badge-name">Kalyan Cafe</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
