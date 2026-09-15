'use client'

import { useEffect, useRef, useState } from 'react'

// Video de fondo del hero (loop silenciado). Con un solo scroll hacia abajo
// (estando en el hero) hace auto-scroll suave a la siguiente sección.
export default function HeroIntro() {
  const vref = useRef(null)
  const [showCue, setShowCue] = useState(false)

  useEffect(() => {
    const v = vref.current
    if (v) {
      v.muted = true
      v.loop = true
      v.play().catch(() => {})
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // scroll normal

    setShowCue(true)
    let done = false
    let touchY = 0

    const jump = () => {
      if (done) return
      done = true
      setShowCue(false)
      cleanup()
      const hero = document.getElementById('top')
      const y = hero ? hero.getBoundingClientRect().bottom + window.scrollY - 8 : window.innerHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    const atTop = () => window.scrollY < 24
    const onWheel = (e) => { if (atTop() && e.deltaY > 0) { e.preventDefault(); jump() } }
    const onKey = (e) => {
      if (atTop() && ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); jump() }
    }
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (atTop() && touchY - e.touches[0].clientY > 10) { e.preventDefault(); jump() }
    }

    function cleanup() {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    // Oculta el cue si el usuario ya se movió de otra forma
    const onScroll = () => { if (!atTop()) { setShowCue(false) } }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => { cleanup(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <>
      <video ref={vref} className="hero-video" muted playsInline preload="auto" poster="/hero.jpg" aria-hidden="true">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      {showCue && (
        <div className="hero-cue" aria-hidden="true"><span>Desplázate</span><span>↓</span></div>
      )}
    </>
  )
}
