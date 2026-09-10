import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getPostSlugs, fmtDate } from '../../../lib/posts'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' }
  }
}

export default async function Post({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <main className="post">
      <div className="wrap post-in">
        <Link href="/blog" className="back">← Volver al blog</Link>

        <div className="post-meta">
          {post.tags?.length ? <span className="pc-tag">{post.tags[0]}</span> : null}
          <span className="pc-date">{fmtDate(post.date)}</span>
        </div>

        <h1>{post.title}</h1>
        {post.description ? <p className="lead">{post.description}</p> : null}
        {post.author ? <p className="by">Por {post.author}</p> : null}

        <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className="post-cta">
          <h3>¿Quieres una web que trabaje por ti?</h3>
          <Link href="/#contacto" className="btn btn-primary btn-lg">Agenda una llamada gratis</Link>
        </div>
      </div>
    </main>
  )
}
