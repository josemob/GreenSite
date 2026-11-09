'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFab from './WhatsAppFab'
import ScrollReveal from './ScrollReveal'

// La landing (/) trae su propia nav, footer y botón de WhatsApp.
// En el resto de rutas (blog, privacidad, proyectos) usamos el chrome global.
export default function Chrome({ children }) {
  const pathname = usePathname()
  const bare = pathname === '/'
  return (
    <>
      {!bare && <Header />}
      {children}
      {!bare && <Footer />}
      {!bare && <WhatsAppFab />}
      {!bare && <ScrollReveal />}
    </>
  )
}
