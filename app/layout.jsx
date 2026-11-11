import './globals.css'
import Chrome from '../components/Chrome'
import Analytics from '../components/Analytics'

export const metadata = {
  metadataBase: new URL('https://greenpop.studio'),
  title: {
    default: 'Greenpop Studio — Webs y apps que venden',
    template: '%s — Greenpop Studio'
  },
  description:
    'Estudio de productos digitales en Venezuela y Latam. Diseñamos y desarrollamos landing pages, webs corporativas, tiendas online y apps que se ven premium y están hechas para vender. Pixel-Perfect. Motion-Ready.',
  keywords: [
    'diseño web Venezuela', 'desarrollo web Latam', 'landing page', 'tienda online',
    'web corporativa', 'app móvil', 'diseño UX UI', 'páginas que venden', 'Greenpop Studio'
  ],
  authors: [{ name: 'José Mobresú' }],
  creator: 'Greenpop Studio',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Greenpop Studio',
    title: 'Greenpop Studio — Webs y apps que venden',
    description: 'Diseño y desarrollo web premium, hecho para vender. Venezuela & Latam.',
    url: 'https://greenpop.studio',
    locale: 'es_ES'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenpop Studio — Webs y apps que venden',
    description: 'Diseño y desarrollo web premium, hecho para vender. Venezuela & Latam.'
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
          <Chrome>{children}</Chrome>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
