import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

const WA = 'https://wa.me/000000000' // TODO: número real de WhatsApp

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-wrap">
        {/* Outro / CTA grande */}
        <div className="foot-cta">
          <h2>¿Listo para una web <span className="a">que venda?</span></h2>
          <div className="row">
            <Link href="/#contacto" className="btn btn-accent btn-lg">Agenda una llamada gratis</Link>
            <a href={WA} target="_blank" rel="noopener" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        <div className="foot-grid">
          {/* Marca + newsletter + redes */}
          <div className="foot-news">
            <Link href="/" className="mark" aria-label="Greenpop Studio" />
            <p>Webs y apps que se ven premium y están hechas para vender. Recibe ideas para vender más por internet.</p>
            <NewsletterForm />
            <div className="foot-social">
              <a href="#" aria-label="Instagram" title="Instagram (pon tu enlace)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.43-.37-1.06-.42-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.17 1.06-.37 2.23-.42C8.42 2.21 8.8 2.2 12 2.2zm0 2.16c-3.14 0-3.5.01-4.74.07-.9.04-1.38.2-1.7.33-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.29.8-.33 1.7-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.04.9.2 1.38.33 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.29 1.7.33 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.2 1.7-.33.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.29-.8.33-1.7.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.2-1.38-.33-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.29-1.7-.33-1.24-.06-1.6-.07-4.74-.07zm0 3.68a4.46 4.46 0 1 1 0 8.92 4.46 4.46 0 0 1 0-8.92zm0 2.16a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6zm5.69-2.4a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn" title="LinkedIn (pon tu enlace)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.65h.05c.53-.95 1.83-1.95 3.77-1.95C20.3 8.7 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z" /></svg>
              </a>
              <a href="https://www.behance.net/greenpopstudio" target="_blank" rel="noopener" aria-label="Behance" title="Behance">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.7 11.3c.83-.42 1.3-1.1 1.3-2.1 0-1.95-1.55-2.6-3.3-2.6H1v10.8h5.9c1.9 0 3.7-.9 3.7-3.05 0-1.33-.63-2.47-1.9-3.05zM3.4 8.5h2.3c.85 0 1.6.24 1.6 1.2 0 .9-.6 1.26-1.46 1.26H3.4zm2.6 7.2H3.4v-2.95h2.65c.98 0 1.74.4 1.74 1.46 0 1.07-.78 1.49-1.79 1.49zM22 13.3c0-2.37-1.4-4.35-3.9-4.35-2.47 0-4.1 1.86-4.1 4.3 0 2.5 1.56 4.25 4.1 4.25 1.93 0 3.2-.87 3.74-2.7h-2.14c-.2.62-.78.93-1.46.93-1.03 0-1.68-.6-1.74-1.68H22c0-.35 0-.7 0-.68zm-5.5-.73c.1-.98.68-1.52 1.6-1.52.96 0 1.42.57 1.5 1.52zM15.5 7.3h5V6h-5z" /></svg>
              </a>
              <a href={WA} target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.52 15.26L2 22l4.86-1.44A10 10 0 1 0 12 2zm0 1.9a8.1 8.1 0 0 1 6.9 12.37l-.33.52.6 2.18-2.24-.59-.5.3A8.1 8.1 0 1 1 12 3.9zm-3.03 4c-.2 0-.52.08-.8.37-.27.3-1.03 1-1.03 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.07 3.3 5.1 4.5 2.52 1 3.03.8 3.58.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35l-1.98-.96c-.27-.13-.47-.2-.67.13l-.62.95c-.15.2-.3.22-.57.07-.27-.13-1.14-.42-2.17-1.34-.8-.72-1.34-1.6-1.5-1.87-.15-.27-.02-.42.12-.56l.42-.5c.14-.16.18-.28.28-.47.1-.2.05-.37-.02-.52l-.9-2.16c-.24-.57-.48-.5-.67-.5z" /></svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h5>Servicios</h5>
            <Link href="/#servicios">Landing Page</Link>
            <Link href="/#servicios">Web Corporativa</Link>
            <Link href="/#servicios">Tienda / Portal</Link>
            <Link href="/#servicios">App Móvil</Link>
          </div>

          <div className="foot-col">
            <h5>Estudio</h5>
            <Link href="/#proceso">Cómo trabajamos</Link>
            <Link href="/#precios">Precios</Link>
            <Link href="/blog">Blog</Link>
          </div>

          <div className="foot-col">
            <h5>Contacto</h5>
            <Link href="/#contacto">Agenda una llamada</Link>
            <a href={WA} target="_blank" rel="noopener">WhatsApp</a>
            <Link href="/#contacto">Escríbenos</Link>
            <a style={{ color: '#8a8f80', cursor: 'default' }}>Venezuela &amp; Latam</a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Greenpop Studio · Pixel-Perfect. Motion-Ready.</span>
          <div className="legal-links">
            <Link href="/privacidad">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
