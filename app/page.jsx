import ContactForm from '../components/ContactForm'
import Featured from '../components/Featured'
import HeroIntro from '../components/HeroIntro'
import { getAllProjects } from '../lib/projects'

export const metadata = {
  title: 'Webs y apps que venden',
  description:
    'Diseñamos páginas, tiendas y apps que se ven premium y están hechas para vender. Rápido, claro y sin complicaciones. Venezuela & Latam.'
}

export default function Home() {
  const projects = getAllProjects()
  return (
    <>
      {/* HERO — full-bleed con imagen de fondo (/public/hero.jpg) */}
      <header className="hero" id="top">
        <HeroIntro />
        <div className="wrap">
          <div className="hero-in">
            <div className="eyebrow">Diseño y desarrollo web · Venezuela &amp; Latam</div>
            <h1 style={{ marginTop: 18 }}>
              Tu web debería traerte clientes. <span className="hl">Hacemos que así sea.</span>
            </h1>
            <p className="lede">
              Diseñamos páginas, tiendas y apps que se ven premium y están hechas para vender. Rápido, claro y sin
              complicaciones.
            </p>
            <div className="cta-row">
              <a href="#contacto" className="btn btn-primary btn-lg">Agenda una llamada gratis</a>
              <a href="#proyectos" className="btn btn-outline btn-lg">Ver proyectos</a>
            </div>
            <div className="trust">
              <span><i className="dot" /> Diseño premium</span>
              <span><i className="dot" /> Entrega rápida</span>
              <span><i className="dot" /> Soporte real</span>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST — stats en línea */}
      <div className="wrap">
        <div className="stats">
          <div className="s"><b>+40</b><span>proyectos entregados</span></div>
          <div className="s"><b>+30</b><span>clientes felices</span></div>
          <div className="s"><b>4.9★</b><span>satisfacción</span></div>
          <div className="s"><b>100%</b><span>a la medida</span></div>
        </div>
      </div>

      {/* PROBLEMA — lista */}
      <section className="sec-band problem">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">¿Te suena?</div>
            <h2>Tu web actual podría estar costándote clientes.</h2>
            <p>Si tu página no genera confianza ni contactos, no está trabajando para ti. Estas son las señales más comunes.</p>
          </div>
          <div className="pains rv">
            <div className="pain"><span className="pn">01</span><div><h4>Se ve desactualizada</h4><p>Un diseño viejo genera desconfianza y aleja a quienes te iban a comprar.</p></div></div>
            <div className="pain"><span className="pn">02</span><div><h4>No apareces en Google</h4><p>Si no te encuentran cuando te buscan, tus clientes terminan con la competencia.</p></div></div>
            <div className="pain"><span className="pn">03</span><div><h4>Nadie te escribe</h4><p>Recibes pocos mensajes o ninguno porque la página no invita a dar el paso.</p></div></div>
          </div>
        </div>
      </section>

      {/* SERVICIOS — filas editoriales */}
      <section className="sec-band" id="servicios">
        <div className="wrap">
          <div className="sv-head rv" style={{ marginBottom: 34 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Lo que hacemos</div>
              <h2 style={{ fontSize: 'clamp(28px,4.4vw,48px)' }}>Elige lo que tu negocio necesita hoy.</h2>
            </div>
            <a href="#contacto" className="btn btn-outline">Hablemos →</a>
          </div>
          <div className="sv-list rv">
            <a className="sv-row" href="#contacto"><span className="nm">Landing Page</span><span className="rt"><span className="pr">Desde $350</span><span className="arw">→</span></span></a>
            <a className="sv-row" href="#contacto"><span className="nm">Web Corporativa</span><span className="rt"><span className="pr">Desde $650</span><span className="arw">→</span></span></a>
            <a className="sv-row" href="#contacto"><span className="nm">Tienda / Portal</span><span className="rt"><span className="pr">Desde $1.800</span><span className="arw">→</span></span></a>
            <a className="sv-row" href="#contacto"><span className="nm">App Móvil</span><span className="rt"><span className="pr">Desde $2.500</span><span className="arw">→</span></span></a>
          </div>
        </div>
      </section>

      {/* PROCESO — pasos conectados */}
      <section className="sec-band" id="proceso">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">Cómo trabajamos</div>
            <h2>Un proceso claro, sin sorpresas.</h2>
            <p>Sabes qué pasa en cada paso y ves tu proyecto antes de que esté terminado.</p>
          </div>
          <div className="steps2 rv">
            <div className="step2"><div className="n">PASO 01</div><h4>Conversamos</h4><p>Entendemos tu negocio y qué necesitas lograr. La primera llamada es gratis.</p></div>
            <div className="step2"><div className="n">PASO 02</div><h4>Diseñamos</h4><p>Ves tu web tomando forma y das tu opinión antes de pagarla completa.</p></div>
            <div className="step2"><div className="n">PASO 03</div><h4>Lanzamos</h4><p>Queda online, lista para funcionar, y te enseñamos a usarla con videos.</p></div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section className="sec-band">
        <div className="wrap">
          <div className="impact rv">
            <h3>No hacemos webs bonitas. Hacemos webs que venden.</h3>
            <p>Cada página está pensada para que tu negocio se vea profesional y para que la gente te contacte.</p>
            <p className="wink">…ok, <b>sí las hacemos bonitas.</b> Pixel-Perfect, Motion-Ready — no lo podemos evitar. 🍋</p>
            <a href="#contacto" className="btn btn-primary btn-lg">Quiero una web así</a>
          </div>
        </div>
      </section>

      {/* POR QUÉ — lista 2 columnas */}
      <section className="sec-band">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">Por qué Greenpop</div>
            <h2>Diseño de nivel, trato cercano.</h2>
          </div>
          <div className="why2 rv">
            <div className="why-item"><span className="m" /><div><h4>Diseño que se ve caro</h4><p>Tu marca proyecta el nivel que realmente tiene.</p></div></div>
            <div className="why-item"><span className="m" /><div><h4>Entregamos rápido</h4><p>Lanzamientos ágiles, sin esperas eternas.</p></div></div>
            <div className="why-item"><span className="m" /><div><h4>Te acompañamos</h4><p>Videos y soporte real para que nunca quedes perdido.</p></div></div>
            <div className="why-item"><span className="m" /><div><h4>Inviertes bien</h4><p>Lo barato sale caro. Aquí tu dinero rinde y se nota.</p></div></div>
          </div>
        </div>
      </section>

      {/* PROYECTOS — portafolio */}
      <section className="sec-band" id="proyectos">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">Portafolio</div>
            <h2>Proyectos que ya lanzamos.</h2>
            <p>Casos reales de negocios que dieron el salto. Míralos por dentro.</p>
          </div>
          <div className="rv">
            <Featured projects={projects} />
          </div>
        </div>
      </section>

      {/* TESTIMONIOS — citas sin cajas */}
      <section className="sec-band" id="testimonios">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">Lo que dicen de nosotros</div>
            <h2>Negocios que ya dieron el paso.</h2>
          </div>
          <div className="quotes2 rv">
            <div className="q2"><div className="who"><div className="av">CM</div><div><b>Carlos M.</b><span>Constructora</span></div></div><div><div className="stars">★★★★★</div><blockquote>&quot;Nuestra web pasó de no generar nada a traernos consultas cada semana. El diseño impresiona.&quot;</blockquote></div></div>
            <div className="q2"><div className="who"><div className="av">AL</div><div><b>Ana L.</b><span>Estudio de arquitectura</span></div></div><div><div className="stars">★★★★★</div><blockquote>&quot;Rápidos, claros y muy profesionales. Por fin una web de la que me siento orgulloso.&quot;</blockquote></div></div>
            <div className="q2"><div className="who"><div className="av">JR</div><div><b>José R.</b><span>Servicios profesionales</span></div></div><div><div className="stars">★★★★★</div><blockquote>&quot;Me explicaron todo en palabras que entiendo. El resultado superó lo que esperaba.&quot;</blockquote></div></div>
          </div>
        </div>
      </section>

      {/* PRECIOS — tabla de filas */}
      <section className="sec-band" id="precios">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="eyebrow">Precios claros</div>
            <h2>Sabes cuánto, desde el inicio.</h2>
            <p>Precios de referencia. ¿Tu proyecto es distinto? Lo adaptamos a tu presupuesto.</p>
          </div>
          <div className="ptable rv">
            <div className="prow"><h4>Landing</h4><div className="incl"><span>1 página que vende</span><span>Diseño a medida</span><span>Lista para Google</span></div><div className="amt2">$350<small> +</small></div><a href="#contacto" className="btn btn-outline">Lo quiero</a></div>
            <div className="prow feat"><h4>Web Corporativa <span className="best">Más elegido</span></h4><div className="incl"><span>Web completa</span><span>Tú la actualizas</span><span>Optimizada para vender</span></div><div className="amt2">$650<small> +</small></div><a href="#contacto" className="btn btn-primary">Lo quiero</a></div>
            <div className="prow"><h4>Tienda / Portal</h4><div className="incl"><span>Vende online</span><span>Portal de clientes</span><span>Pagos integrados</span></div><div className="amt2">$1.800<small> +</small></div><a href="#contacto" className="btn btn-outline">Lo quiero</a></div>
            <div className="prow"><h4>App Móvil</h4><div className="incl"><span>iPhone y Android</span><span>A tu medida</span><span>Soporte incluido</span></div><div className="amt2">$2.500<small> +</small></div><a href="#contacto" className="btn btn-outline">Lo quiero</a></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec-band">
        <div className="wrap">
          <div className="sec-head rv" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="eyebrow">Preguntas frecuentes</div>
            <h2>Lo que casi todos preguntan.</h2>
          </div>
          <div className="faq rv">
            <details open><summary>¿Cuánto tarda mi proyecto?</summary><p>Una landing puede estar lista en 1–2 semanas; una web completa entre 3 y 5. Te damos una fecha clara desde el inicio.</p></details>
            <details><summary>¿Yo puedo editar mi web después?</summary><p>Sí. Te la entregamos con una sección donde puedes cambiar textos e imágenes tú mismo, y te enseñamos con videos.</p></details>
            <details><summary>¿Cuánto cuesta mantenerla?</summary><p>El mantenimiento es opcional, desde $150/mes. Si prefieres, la dejamos lista y tú la manejas sin costo mensual.</p></details>
            <details><summary>No sé qué necesito. ¿Me ayudan?</summary><p>Para eso es la llamada gratis. Escuchamos tu caso y te recomendamos la opción justa, sin venderte de más.</p></details>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="sec-band" id="contacto">
        <div className="wrap">
          <div className="final rv">
            <div>
              <div className="eyebrow">Hablemos</div>
              <h3>Cuéntanos qué necesitas. La primera llamada es gratis.</h3>
              <p>Déjanos tus datos y te contactamos hoy mismo. Sin compromiso y en palabras que entiendes.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
