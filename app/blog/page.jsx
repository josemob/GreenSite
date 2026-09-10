import Link from 'next/link'
import { getAllPosts, fmtDate } from '../../lib/posts'

export const metadata = {
  title: 'Blog',
  description: 'Ideas claras sobre diseño web, conversión y cómo hacer que tu negocio venda más por internet.'
}

export default function Blog() {
  const posts = getAllPosts()

  return (
    <main className="blog">
      <div className="wrap">
        <header className="blog-head rv in">
          <div className="eyebrow">The Lab · Blog</div>
          <h1>Ideas para que tu negocio venda más.</h1>
          <p>Diseño, conversión y estrategia digital explicados en simple. Sin humo.</p>
        </header>

        {posts.length > 0 ? (
          <div className="postlist">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="plink">
                <div className="meta">
                  {post.tags?.length ? <span className="tag">{post.tags[0]}</span> : null}
                  <span className="date">{fmtDate(post.date)}</span>
                </div>
                <div>
                  <h2>{post.title}</h2>
                  <p className="ex">{post.description}</p>
                </div>
                <span className="go">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty">Muy pronto publicaremos nuestros primeros artículos. 🍋</p>
        )}
      </div>
    </main>
  )
}
