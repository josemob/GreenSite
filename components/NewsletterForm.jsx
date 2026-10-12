'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [done, setDone] = useState(false)

  // TODO: conectar a un servicio real (Mailchimp, Buttondown, Formspree, etc.)
  function onSubmit(e) {
    e.preventDefault()
    setDone(true)
  }

  if (done) return <p className="news-ok">¡Listo! Te avisaremos de las novedades. 🍋</p>

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <input type="email" required placeholder="Tu email" aria-label="Correo electrónico" />
      <button type="submit">Suscribirme</button>
    </form>
  )
}
