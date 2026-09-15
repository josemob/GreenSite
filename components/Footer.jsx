import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Link href="/" className="mark" aria-label="Greenpop Studio" />
            <p className="about">
              Diseñamos y desarrollamos productos digitales que se ven premium y están hechos para vender.{' '}
              <em>Pixel-Perfect. Motion-Ready.</em>
            </p>
          </div>
          <div className="col">
            <h5>Servicios</h5>
            <Link href="/#servicios">Landing Page</Link>
            <Link href="/#servicios">Web Corporativa</Link>
            <Link href="/#servicios">Tienda / Portal</Link>
            <Link href="/#servicios">App Móvil</Link>
          </div>
          <div className="col">
            <h5>Estudio</h5>
            <Link href="/#proceso">Cómo trabajamos</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#precios">Precios</Link>
          </div>
          <div className="col">
            <h5>Contacto</h5>
            <Link href="/#contacto">Agenda una llamada</Link>
            <a href="https://wa.me/000000000" target="_blank" rel="noopener">WhatsApp</a>
            <Link href="/#contacto">Escríbenos</Link>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Greenpop Studio. Todos los derechos reservados.</span>
          <span><Link href="/privacidad">Privacidad</Link></span>
        </div>
      </div>
    </footer>
  )
}
