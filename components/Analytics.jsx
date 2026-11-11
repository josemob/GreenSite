'use client'

import { useEffect, useState } from 'react'
import { GA_ID } from '../lib/siteConfig'

const KEY = 'gp-cookie-consent'

function loadGA() {
  if (!GA_ID || typeof window === 'undefined' || window.__gpGA) return
  window.__gpGA = true
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID, { anonymize_ip: true })
}

export default function Analytics() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    let c = null
    try { c = localStorage.getItem(KEY) } catch (e) {}
    if (c === 'granted') loadGA()
    else if (c !== 'denied') setShow(true)
  }, [])

  if (!GA_ID || !show) return null

  const decide = (v) => {
    try { localStorage.setItem(KEY, v) } catch (e) {}
    if (v === 'granted') loadGA()
    setShow(false)
  }

  return (
    <div role="dialog" aria-label="Aviso de cookies" style={{
      position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 2147483000,
      maxWidth: 560, margin: '0 auto', background: '#0D0D0D', color: '#F3F2F2',
      borderRadius: 20, padding: '20px 22px', boxShadow: '0 20px 60px rgba(0,0,0,.4)',
      fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', gap: 14
    }}>
      <div style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(243,242,242,.85)' }}>
        Usamos cookies de analítica para entender cómo se usa el sitio y mejorarlo. Puedes aceptarlas o rechazarlas.{' '}
        <a href="/cookies" style={{ color: '#D4FF00', textDecoration: 'underline' }}>Más info</a>.
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => decide('granted')} style={{
          flex: '1 1 auto', minWidth: 140, cursor: 'pointer', border: 'none',
          background: '#D4FF00', color: '#0D0D0D', fontWeight: 600, fontSize: 15,
          padding: '12px 18px', borderRadius: 999, fontFamily: 'inherit'
        }}>Aceptar</button>
        <button onClick={() => decide('denied')} style={{
          flex: '1 1 auto', minWidth: 140, cursor: 'pointer',
          background: 'transparent', color: '#F3F2F2', fontWeight: 500, fontSize: 15,
          padding: '12px 18px', borderRadius: 999, border: '1.5px solid rgba(243,242,242,.4)',
          fontFamily: 'inherit'
        }}>Rechazar</button>
      </div>
    </div>
  )
}
