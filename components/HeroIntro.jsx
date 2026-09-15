'use client'

import { useEffect, useRef, useState } from 'react'

// Intro del hero: al primer scroll reproduce el video de fondo y, al terminar,
// hace auto-scroll a la siguiente sección. Con botón "Saltar", respeta
// prefers-reduced-motion y no se repite en visitas siguientes.
export default function HeroIntro() {
  const vref = useRef(null)
  const finishRef = useRef(null)
  const [phase, setPhase] = useState('done') // done = sin intro (default seguro para SSR)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    const v = vref.current
    if (!v) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = false
    try { seen = localStorage.getItem('gp_hero_intro') === '1' } catch {}

    // Visitas siguientes o reduced-motion: video ambiente en loop silenciado, sin bloquear.
    if (reduce || seen) {
      v.muted = true
      v.loop = true
      v.play().catch(() => {})
      return
    }

    // --- Flujo de intro ---
    setPhase('idle')
    setShowSkip(true)

    const html = document.documentElement
    const body = document.body
    const prevH = html.style.overflow
    const prevB = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    let started = false
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      try { localStorage.setItem('gp_hero_intro', '1') } catch {}
      html.style.overflow = prevH
      body.style.overflow = prevB
      cleanup()
      setPhase('done')
      setShowSkip(false)
      const hero = document.getElementById('top')
      const y = hero ? hero.getBoundingClientRect().bottom + window.scrollY - 8 : window.innerHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    finishRef.current = finish

    const start = () => {
      if (started) return
      started = true
      setPhase('playing')
      v.muted = true
      const p = v.play()
      if (p && p.catch) p.catch(() => finish()) // si no puede reproducir, seguimos
    }

    const onWheel = (e) => { if (e.cancelable) e.preventDefault(); start() }
    const onTouch = (e) => { if (e.cancelable) e.preventDefault(); start() }
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); start() }
      else if (e.key === 'Escape') { finish() }
    }

    function cleanup() {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('keydown', onKey)
      v.removeEventListener('ended', finish)
      v.removeEventListener('error', finish)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchmove', onTouch, { passive: false })
    window.addEventListener('keydown', onKey)
    v.addEventListener('ended', finish)
    v.addEventListener('error', finish)

    return () => {
      html.style.overflow = prevH
      body.style.overflow = prevB
      cleanup()
    }
  }, [])

  return (
    <>
      <video ref={vref} className="hero-video" muted playsInline preload="auto" poster="/hero.jpg" aria-hidden="true">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      {phase === 'idle' && (
        <div className="hero-cue" aria-hidden="true"><span>Desplázate</span><span>↓</span></div>
      )}
      {showSkip && (
        <button className="hero-skip" onClick={() => finishRef.current && finishRef.current()}>
          Saltar intro →
        </button>
      )}
    </>
  )
}
