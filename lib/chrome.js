import fs from 'node:fs'
import path from 'node:path'
import { renderDesign } from './dcEngine'

const WA = 'https://wa.me/584128172712?text=' +
  encodeURIComponent('Hola Greenpop, quiero una revisión de mi web.')

// Renderiza el chrome del sitio (nav + footer Greenpop, idéntico a las subpáginas)
// y lo parte en { top, bottom, css } por el marcador <!--GP_SLOT-->.
// El contenido de la página se inserta entre `top` y `bottom`, todo dentro de
// un contenedor con id="gp-root" (el CSS de enlaces y :hover está scoped a él).
export function renderChrome() {
  const body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/chrome.html'), 'utf8')
  const { html, css } = renderDesign(body, { waLink: WA })
  const [top, bottom] = html.split('<!--GP_SLOT-->')
  return { top: top.trim(), bottom: (bottom || '').trim(), css }
}
