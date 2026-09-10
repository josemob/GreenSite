import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getProjectSlugs } from '../../../lib/projects'

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) return {}
  return {
    title: `${p.title} — ${p.category}`,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, type: 'article' }
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) notFound()

  return (
    <main className="case">
      <div className="wrap case-in">
        <Link href="/#proyectos" className="back">← Volver a proyectos</Link>

        <div className="cmeta">
          <span className="cat">{p.category}</span>
          {p.year ? (<><span className="sep" /><span>{p.year}</span></>) : null}
          {p.client ? (<><span className="sep" /><span>{p.client}</span></>) : null}
        </div>

        <h1>{p.title}</h1>
        {p.summary ? <p className="lead">{p.summary}</p> : null}

        <div className="case-cta">
          {p.url ? (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Ver web en vivo ↗
            </a>
          ) : null}
          {p.behance ? (
            <a href={p.behance} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              Ver en Behance ↗
            </a>
          ) : null}
        </div>

        {/* Portada (placeholder — reemplazar por captura/mockup real del proyecto) */}
        <div className="case-cover" aria-hidden="true">
          <span className="dots"><i /><i /><i /></span>
          <span className="cv-name">{p.client || p.title}</span>
          <span className="cv-lemon" />
        </div>

        {p.results?.length ? (
          <div className="results">
            {p.results.map((r, i) => (
              <div className="r" key={i}>
                <b>{r.value}</b>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {p.services?.length ? (
          <div className="svc-tags">
            {p.services.map((s, i) => (
              <span className="t" key={i}>{s}</span>
            ))}
          </div>
        ) : null}

        <article className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />

        <div className="case-cta-bottom">
          <h3>¿Quieres resultados así para tu negocio?</h3>
          <Link href="/#contacto" className="btn btn-primary btn-lg">Agenda una llamada gratis</Link>
        </div>
      </div>
    </main>
  )
}
