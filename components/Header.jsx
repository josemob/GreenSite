'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [solid, setSolid] = useState(!isHome)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      // ocultar al bajar (pasado un umbral), mostrar al subir
      setHidden(y > lastY && y > 140)
      // fondo sólido: en subpáginas siempre; en home al pasar el hero
      setSolid(isHome ? y > window.innerHeight * 0.7 : true)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const over = isHome && !solid

  return (
    <nav className={`site-nav${solid ? ' --solid' : ''}${hidden ? ' --hidden' : ''}${over ? ' --over' : ''}`}>
      <div className="nav-in">
        <Link href="/" className="mark" aria-label="Greenpop Studio — inicio" />
        <div className="nav-links">
          <Link href="/#servicios">Servicios</Link>
          <Link href="/#proceso">Cómo trabajamos</Link>
          <Link href="/#precios">Precios</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <Link href="/#contacto" className="btn btn-primary">Agenda una llamada gratis</Link>
      </div>
    </nav>
  )
}
