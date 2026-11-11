import fs from 'node:fs'
import path from 'node:path'
import { renderDesign } from './dcEngine'

const WA = 'https://wa.me/584128172712?text=' +
  encodeURIComponent('Hola Greenpop, tengo una consulta sobre el sitio.')

// Renderiza una página legal con el diseño nuevo (nav + footer Greenpop).
// content: HTML de la prosa (se inyecta tal cual dentro de .gp-legal).
export function renderLegal({ title, updated, content }) {
  const body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/legal.html'), 'utf8')
  return renderDesign(body, { title, updated, content, waLink: WA })
}
