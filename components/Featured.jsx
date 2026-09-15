'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Featured({ projects }) {
  const [active, setActive] = useState(0)

  return (
    <div className="fw">
      <div className="fw-list">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/proyectos/${p.slug}`}
            className={`fw-item${i === active ? ' is-active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className="cat">{p.category}</div>
            <div className="name">{p.title}</div>
            <span className="go">Ver caso →</span>
          </Link>
        ))}
      </div>

      <div className="fw-preview" aria-hidden="true">
        {projects.map((p, i) => (
          <div key={p.slug} className={`fw-shot${i === active ? ' is-active' : ''}`}>
            <span className="dots"><i /><i /><i /></span>
            <span className="cv">{p.client}</span>
            <span className="lemon" />
          </div>
        ))}
      </div>
    </div>
  )
}
