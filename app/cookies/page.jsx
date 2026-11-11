import { renderLegal } from '../../lib/legal'
import GPSubpageClient from '../../components/GPSubpageClient'

export const metadata = {
  title: 'Política de Cookies',
  description: 'Qué cookies usa Greenpop Studio y cómo gestionarlas.',
  alternates: { canonical: '/cookies' }
}

const content = `
<p class="lead">En <strong>Greenpop Studio</strong> usamos cookies para que el sitio funcione correctamente y para entender cómo se usa, de forma anónima. Aquí te explicamos cuáles usamos y cómo controlarlas.</p>

<h2>1. ¿Qué son las cookies?</h2>
<p>Son pequeños archivos que un sitio guarda en tu dispositivo para recordar información, como tus preferencias o datos de navegación anónimos.</p>

<h2>2. Cookies que usamos</h2>
<ul>
  <li><strong>Esenciales:</strong> necesarias para el funcionamiento del sitio y para recordar tu decisión sobre las cookies. No se pueden desactivar.</li>
  <li><strong>Analíticas (Google Analytics):</strong> nos ayudan a medir las visitas y el rendimiento del sitio de forma agregada y anónima (con la IP anonimizada). Solo se activan si las aceptas en el aviso de cookies.</li>
</ul>

<h2>3. Tu consentimiento</h2>
<p>La primera vez que entras, te mostramos un aviso para <strong>aceptar</strong> o <strong>rechazar</strong> las cookies analíticas. Si las rechazas, no se cargará Google Analytics. Puedes cambiar tu decisión borrando los datos del sitio en tu navegador y recargando la página.</p>

<h2>4. Cómo gestionarlas en tu navegador</h2>
<p>Puedes bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge, etc.). Ten en cuenta que algunas funciones podrían verse afectadas.</p>

<h2>5. Terceros</h2>
<p>Google Analytics es un servicio de Google. Puedes consultar cómo trata los datos en las políticas de Google y usar su <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">complemento de inhabilitación</a>.</p>

<h2>6. Contacto</h2>
<p>¿Dudas sobre las cookies? Escríbenos a <a href="mailto:mediagreenpop@gmail.com">mediagreenpop@gmail.com</a>.</p>

<p>Ver también nuestra <a href="/privacidad">Política de Privacidad</a> y los <a href="/terminos">Términos y Condiciones</a>.</p>
`

export default function Cookies() {
  const { html, css } = renderLegal({
    title: 'Política de Cookies',
    updated: '9 de noviembre de 2026',
    content
  })
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <GPSubpageClient />
    </>
  )
}
