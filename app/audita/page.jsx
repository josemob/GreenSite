import AuditaClient from '../../components/AuditaClient'
import GPSubpageClient from '../../components/GPSubpageClient'
import { renderChrome } from '../../lib/chrome'

export const metadata = {
  title: 'Auditoría gratis — ¿Tu web vende?',
  description: 'Analiza gratis la velocidad, el SEO y la experiencia de tu web con datos reales de Google. Sin registro. Recibe un veredicto claro y cómo mejorarlo.',
  alternates: { canonical: '/audita' },
  openGraph: {
    title: 'Auditoría web gratis — Greenpop Studio',
    description: 'Mide velocidad, SEO y experiencia de tu web en segundos. Sin registro.',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Auditoría web gratis — Greenpop Studio' }]
  },
  twitter: { card: 'summary_large_image', title: 'Auditoría web gratis — Greenpop Studio', description: 'Mide velocidad, SEO y experiencia de tu web en segundos. Sin registro.', images: ['/og.jpg'] }
}

export default function AuditaPage() {
  const { top, bottom, css } = renderChrome()
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div id="gp-root" style={{ fontFamily: "'Outfit', sans-serif", background: '#F3F2F2', color: '#0D0D0D', minHeight: '100vh', overflowX: 'clip' }}>
        <div dangerouslySetInnerHTML={{ __html: top }} />
        <AuditaClient />
        <div dangerouslySetInnerHTML={{ __html: bottom }} />
      </div>
      <GPSubpageClient />
    </>
  )
}
