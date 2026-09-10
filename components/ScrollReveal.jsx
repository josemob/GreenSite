'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Reveal on-scroll: elementos con la clase .rv aparecen al entrar en viewport.
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rv:not(.in)'))
    if (!els.length) return

    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((e) => io.observe(e))

    return () => io.disconnect()
  }, [pathname])

  return null
}
