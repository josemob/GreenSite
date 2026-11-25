import AuditaClient from '../../components/AuditaClient'

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
  return <AuditaClient />
}
