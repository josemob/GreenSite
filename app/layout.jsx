import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFab from '../components/WhatsAppFab'
import ScrollReveal from '../components/ScrollReveal'

export const metadata = {
  metadataBase: new URL('https://greenpop.studio'),
  title: {
    default: 'Greenpop Studio — Webs y apps que venden',
    template: '%s — Greenpop Studio'
  },
  description:
    'Diseñamos y desarrollamos páginas web, tiendas y apps premium que traen clientes. Pixel-Perfect. Motion-Ready. Venezuela & Latam.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    title: 'Greenpop Studio — Webs y apps que venden',
    description: 'Diseño y desarrollo web premium, hecho para vender.',
    locale: 'es_ES'
  }
}

export const viewport = {
  themeColor: '#0D0D0D'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="pg">
          <Header />
          {children}
          <Footer />
          <WhatsAppFab />
          <ScrollReveal />
        </div>
      </body>
    </html>
  )
}
