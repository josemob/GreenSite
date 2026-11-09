import fs from 'node:fs'
import path from 'node:path'
import { getAllPosts, fmtMonthYear } from '../../lib/posts'
import { renderDesign, coverFor } from '../../lib/dcEngine'
import GPSubpageClient from '../../components/GPSubpageClient'

export const metadata = {
  title: 'Blog — Ideas para vender más',
  description:
    'Artículos sobre webs, tiendas y apps que venden, explicados en simple. Conversión, e-commerce, diseño y guías para negocios en Venezuela y Latam.',
  alternates: { canonical: '/blog' }
}

const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, vengo del blog y quiero hablar de mi proyecto.')

export default function BlogPage() {
  let body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/blog.html'), 'utf8')
  // marcar categoría en tarjetas y botones (para el filtro client-side)
  body = body
    .replace('<a href="Post.dc.html"', '<a href="Post.dc.html" data-cat="{{ p.cat }}"')
    .replace('<button type="button" onClick="{{ c.pick }}"', '<button type="button" data-cat="{{ c.label }}" onClick="{{ c.pick }}"')

  const posts = getAllPosts().map((p, i) => {
    const cat = (p.tags && p.tags[0]) || 'Artículo'
    return {
      href: `/blog/${p.slug}`,
      cat,
      img: coverFor(p.cover, cat, i),
      time: fmtMonthYear(p.date),
      author: p.author || 'José Mobresú',
      title: p.title,
      excerpt: p.description,
      blur: '0px', scale: '1', veil: '0', revOp: '0', revBlur: '10px', revY: '14px', tW: '400'
    }
  })
  const uniqueCats = [...new Set(posts.map((p) => p.cat))]
  const cats = ['Todos', ...uniqueCats].map((label) => {
    const on = label === 'Todos'
    return { label, bg: on ? '#D4FF00' : 'transparent', bd: on ? '#D4FF00' : 'rgba(13,13,13,.25)', fw: on ? '600' : '400' }
  })

  const data = { posts, cats, empty: posts.length === 0, hasMore: false, waLink: WA }
  const { html, css } = renderDesign(body, data)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <GPSubpageClient />
    </>
  )
}
