import Link from 'next/link'

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Condiciones de uso del sitio y de los servicios de Greenpop Studio.',
  alternates: { canonical: '/terminos' }
}

const ACTUALIZADO = '9 de noviembre de 2026'

export default function Terminos() {
  return (
    <main className="doc">
      <div className="wrap doc-in">
        <Link href="/" className="back">← Volver al inicio</Link>
        <div className="eyebrow">Legales</div>
        <h1>Términos y Condiciones</h1>
        <p className="upd">Última actualización: {ACTUALIZADO}</p>

        <p>
          Bienvenido a <strong>Greenpop Studio</strong>. Al acceder y usar este sitio web (greenpop.studio) y al
          contratar nuestros servicios, aceptas estos términos. Si no estás de acuerdo, por favor no utilices el sitio.
        </p>

        <h2>1. Quiénes somos</h2>
        <p>
          Greenpop Studio es un estudio de productos digitales que diseña y desarrolla landing pages, webs corporativas,
          tiendas online y aplicaciones, con base en Venezuela y alcance en Latinoamérica.
        </p>

        <h2>2. Uso del sitio</h2>
        <ul>
          <li>Te comprometes a usar el sitio de forma legal y a no dañar, sobrecargar o inutilizar su funcionamiento.</li>
          <li>No está permitido copiar, reproducir o redistribuir el contenido del sitio sin nuestra autorización.</li>
          <li>Los enlaces a sitios de terceros se ofrecen solo por conveniencia; no respondemos por su contenido.</li>
        </ul>

        <h2>3. Servicios y presupuestos</h2>
        <ul>
          <li>La información del sitio es orientativa y no constituye una oferta vinculante.</li>
          <li>Cada proyecto se formaliza mediante un presupuesto y/o propuesta que detalla alcance, tiempos y precio.</li>
          <li>Los plazos estimados pueden variar según la entrega de contenidos, aprobaciones y cambios solicitados.</li>
        </ul>

        <h2>4. Pagos</h2>
        <p>
          Salvo acuerdo distinto por escrito, los proyectos se inician con un anticipo y el saldo se abona según los
          hitos acordados. Las condiciones específicas se indican en cada propuesta.
        </p>

        <h2>5. Propiedad intelectual</h2>
        <p>
          Una vez pagado el proyecto en su totalidad, los entregables finales son de tu propiedad, salvo el software,
          librerías o componentes de terceros, que se rigen por sus propias licencias. Greenpop Studio puede mostrar el
          trabajo en su portafolio salvo acuerdo de confidencialidad.
        </p>

        <h2>6. Responsabilidad</h2>
        <p>
          Trabajamos con el mayor cuidado, pero el sitio y los servicios se ofrecen "tal cual". No garantizamos
          resultados comerciales específicos ni nos responsabilizamos por daños indirectos derivados del uso del sitio.
        </p>

        <h2>7. Cambios</h2>
        <p>Podemos actualizar estos términos en cualquier momento. La versión vigente se publica en esta página con su fecha.</p>

        <h2>8. Contacto</h2>
        <p>
          ¿Dudas sobre estos términos? Escríbenos a <a href="mailto:mediagreenpop@gmail.com">mediagreenpop@gmail.com</a>.
        </p>

        <p style={{ marginTop: 28 }}>
          Ver también nuestra <Link href="/privacidad">Política de Privacidad</Link> y la{' '}
          <Link href="/cookies">Política de Cookies</Link>.
        </p>
      </div>
    </main>
  )
}
