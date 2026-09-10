import Link from 'next/link'

export default function Header() {
  return (
    <nav>
      <div className="wrap nav-in">
        <Link href="/" className="mark" aria-label="Greenpop Studio — inicio" />
        <div className="nav-links">
          <Link href="/#servicios">Servicios</Link>
          <Link href="/#proceso">Cómo trabajamos</Link>
          <Link href="/#proyectos">Proyectos</Link>
          <Link href="/#precios">Precios</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <Link href="/#contacto" className="btn btn-primary">Agenda una llamada gratis</Link>
      </div>
    </nav>
  )
}
