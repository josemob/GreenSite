// Motor que resuelve el markup Claude Design (.dc) a HTML estático con datos reales.
// Se ejecuta en build-time dentro de los Server Components. Devuelve { html, css }.

const DEFAULT_REFS = {
  navRef: 'gpNav', heroRef: 'gpHero', probRef: 'gpProb',
  videoRef: 'gpHeroVideo', pfRef: 'gpPf', tstRef: 'gpTst'
}

// ---------- helpers de resolución ----------
function getVal(expr, scope, rv) {
  expr = expr.trim()
  const parts = expr.split('.')
  let cur = (parts[0] in scope) ? scope[parts[0]] : rv[parts[0]]
  for (let i = 1; i < parts.length && cur != null; i++) cur = cur[parts[i]]
  return cur
}
function firstTag(name, s) {
  const re = new RegExp('<' + name + '(\\s|>)', 'g')
  const m = re.exec(s); return m ? m.index : -1
}
function matchClose(name, s, openIdx) {
  const openEnd = s.indexOf('>', openIdx) + 1
  let depth = 1, i = openEnd
  const open = new RegExp('<' + name + '(\\s|>)', 'g')
  const close = new RegExp('</' + name + '>', 'g')
  while (i < s.length) {
    open.lastIndex = i; close.lastIndex = i
    const mo = open.exec(s), mc = close.exec(s)
    if (!mc) break
    if (mo && mo.index < mc.index) { depth++; i = mo.index + 1 }
    else { depth--; if (depth === 0) return [openEnd, mc.index, mc.index + ('</' + name + '>').length]; i = mc.index + 1 }
  }
  return [openEnd, s.length, s.length]
}
function injectAttr(html, attr) {
  return html.replace(/^\s+/, '').replace(/^(<[a-zA-Z0-9-]+)/, '$1 ' + attr)
}
function imgSlot(attrsStr) {
  const get = (n) => { const m = attrsStr.match(new RegExp(n + '="([^"]*)"')); return m ? m[1] : null }
  const src = get('src'), shape = get('shape') || 'rect', fit = get('fit') || 'cover'
  const ph = get('placeholder') || '', style = get('style') || 'position:absolute;inset:0'
  const radius = shape === 'circle' ? ';border-radius:999px' : ''
  if (src) {
    const size = fit === 'contain' ? 'contain' : 'cover'
    return `<image-slot style="${style};width:100%;height:100%;background-image:url(${src});background-size:${size};background-position:center;background-repeat:no-repeat;display:block${radius}"></image-slot>`
  }
  if (shape === 'circle') return `<image-slot style="${style};width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:18px${radius}">${ph}</image-slot>`
  if (/^logo/i.test(ph)) return `<image-slot style="${style};display:block"></image-slot>`
  return `<image-slot style="${style};width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(13,13,13,.04);color:rgba(243,242,242,.28);font-size:12px;text-align:center;padding:10px;box-sizing:border-box${radius}">${ph}</image-slot>`
}

function makeRender(rv) {
  function resolveHB(html, scope) {
    html = html.replace(/<image-slot\b([^>]*)>\s*<\/image-slot>/g, (m, a) => imgSlot(resolveHB(a, scope)))
    html = html.replace(/<image-slot\b([^>]*)\/>/g, (m, a) => imgSlot(resolveHB(a, scope)))
    html = html.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (m, expr) => { const v = getVal(expr, scope, rv); return v == null ? '' : String(v) })
    return html
  }
  function render(html, scope) {
    while (true) {
      const iFor = firstTag('sc-for', html), iIf = firstTag('sc-if', html)
      if (iFor < 0 && iIf < 0) break
      const isFor = iIf < 0 || (iFor >= 0 && iFor < iIf)
      const name = isFor ? 'sc-for' : 'sc-if', idx = isFor ? iFor : iIf
      const openTag = html.slice(idx, html.indexOf('>', idx) + 1)
      const [is, ie, after] = matchClose(name, html, idx)
      const inner = html.slice(is, ie)
      let out = ''
      if (isFor) {
        const listExpr = openTag.match(/list="\{\{\s*([^}]+?)\s*\}\}"/)[1]
        const asVar = openTag.match(/as="([^"]+)"/)[1]
        const list = getVal(listExpr, scope, rv) || []
        out = list.map(item => render(inner, { ...scope, [asVar]: item })).join('\n')
      } else {
        const valExpr = openTag.match(/value="\{\{\s*([^}]+?)\s*\}\}"/)[1].trim()
        if (valExpr === 'pfMob') out = injectAttr(render(inner, scope), 'class="gpMobOnly"')
        else if (valExpr === 'pfDesk') out = injectAttr(render(inner, scope), 'class="gpDeskOnly"')
        else if (valExpr === 'notSent') out = render(inner, scope)
        else if (valExpr === 'sent') out = render(inner, scope).replace(/^\s+/, '').replace(/^(<[a-zA-Z0-9-]+)([^>]*?)style="([^"]*)"/, '$1 data-gp-form="done"$2style="$3;display:none"')
        else out = getVal(valExpr, scope, rv) ? render(inner, scope) : ''
      }
      html = html.slice(0, idx) + out + html.slice(after)
    }
    return resolveHB(html, scope)
  }
  return render
}

// ---------- API ----------
// body: markup crudo del .dc (entre </helmet> y </x-dc>)
// data: objeto rv (datos + marcadores)
// opts.links: mapa extra de href de *.dc.html -> ruta
export function renderDesign(body, data, opts = {}) {
  const hoverRules = []
  let hoverN = 0

  // refs -> ids
  for (const [ref, id] of Object.entries(DEFAULT_REFS)) {
    body = body.replace(new RegExp('\\s*ref="\\{\\{\\s*' + ref + '\\s*\\}\\}"', 'g'), ' id="' + id + '"')
  }
  body = body.replace(/\s*ref="\{\{\s*p\.ref\s*\}\}"/g, ' class="gpProbCard"')

  // root id
  body = body.replace(
    /<div style="font-family:'Outfit',sans-serif;background:#F3F2F2;color:#0D0D0D;min-height:100vh;overflow-x:clip">/,
    '<div id="gp-root" style="font-family:\'Outfit\',sans-serif;background:#F3F2F2;color:#0D0D0D;min-height:100vh;overflow-x:clip">'
  )
  // menu id
  body = body.replace('<div style="position:fixed;inset:16px;z-index:80;', '<div id="gpMenu" style="position:fixed;inset:16px;z-index:80;')

  // menu handlers
  body = body.replace(/onClick="\{\{\s*openMenu\s*\}\}"/g, 'data-gp="menuOpen"')
             .replace(/onClick="\{\{\s*closeMenu\s*\}\}"/g, 'data-gp="menuClose"')

  // hover de tarjetas (p.hin/p.hout) -> clase gpHoverCard
  body = body.replace(/\s*onMouseEnter="\{\{\s*[\w.]+\.hin\s*\}\}"\s*onMouseLeave="\{\{\s*[\w.]+\.hout\s*\}\}"/g, ' class="gpHoverCard"')
  // otros handlers (loadMore, pick, submit, etc.) -> data-gp
  body = body.replace(/onClick="\{\{\s*loadMore\s*\}\}"/g, 'data-gp="loadMore"')
  body = body.replace(/onClick="\{\{\s*([\w.]+)\.pick\s*\}\}"/g, 'data-gp-pick')
  body = body.replace(/\s*onClick="\{\{[^}]*\}\}"/g, '')
  body = body.replace(/\s*onChange="\{\{[^}]*\}\}"/g, '')
  body = body.replace(/\s*onSubmit="\{\{[^}]*\}\}"/g, ' data-gp-form="idle"')

  // responsive scalars
  body = body.replace(/\{\{\s*deskD\s*\}\}/g, 'var(--gpd,flex)')
             .replace(/\{\{\s*mobD\s*\}\}/g, 'var(--gpm,none)')
             .replace(/\{\{\s*footLogoCol\s*\}\}/g, 'var(--gpfoot,span 2)')
  // menu resting
  body = body.replace(/\{\{\s*menuOp\s*\}\}/g, '0').replace(/\{\{\s*menuS\s*\}\}/g, '.96').replace(/\{\{\s*menuPE\s*\}\}/g, 'none')

  // enlaces entre páginas del diseño -> rutas reales
  body = body.replace(/href="Greenpop Landing\.dc\.html(#[\w-]+)?"/g, (m, h) => 'href="/' + (h || '') + '"')
  body = body.replace(/href="Blog\.dc\.html"/g, 'href="/blog"')
             .replace(/href="Portafolio\.dc\.html"/g, 'href="/portafolio"')
  // Post/Proyecto llevan slug: el markup pone href por item vía data (p.href)
  body = body.replace(/href="Post\.dc\.html"/g, 'href="{{ p.href }}"')
             .replace(/href="Proyecto\.dc\.html"/g, 'href="{{ p.href }}"')
  for (const [from, to] of Object.entries(opts.links || {})) body = body.split(from).join(to)

  // boolean attrs {{ true }}
  body = body.replace(/(\w+)="\{\{\s*true\s*\}\}"/g, (m, a) => a.toLowerCase())

  // style-hover -> clase + regla !important
  body = body.replace(/\s*style-hover="([^"]*)"/g, (m, decls) => {
    const cls = 'gph' + (++hoverN)
    const rule = decls.split(';').filter(Boolean).map(d => { const i = d.indexOf(':'); return i < 0 ? '' : d.slice(0, i).trim() + ':' + d.slice(i + 1).trim() + '!important' }).filter(Boolean).join(';')
    hoverRules.push(`#gp-root .${cls}:hover{${rule}}`)
    return ` data-gphover="${cls}"`
  })

  // resolver loops + handlebars
  const render = makeRender(data)
  body = render(body, {})

  // aplicar clase de hover
  body = body.replace(/<([a-zA-Z0-9-]+)([^>]*?)\sdata-gphover="([^"]+)"([^>]*)>/g, (m, tag, pre, cls, post) => {
    const full = pre + post
    if (/\sclass="/.test(full)) return `<${tag}${(pre + post).replace(/\sclass="([^"]*)"/, (mm, c) => ` class="${c} ${cls}"`)}>`
    return `<${tag} class="${cls}"${pre}${post}>`
  })

  // rutas de assets
  body = body.replace(/assets\//g, '/assets/').replace(/\/\/assets\//g, '/assets/')

  const css = [
    `#gp-root a{color:#0D0D0D;text-decoration:none}`,
    `#gp-root a:hover{color:#0D0D0D;text-decoration:underline}`,
    `#gp-root ::selection{background:#D4FF00;color:#0D0D0D}`,
    `#gp-root input,#gp-root select,#gp-root button,#gp-root textarea{font-family:'Outfit',sans-serif}`,
    `#gp-root :focus-visible{outline:2px solid #0D0D0D;outline-offset:2px}`,
    `@media(max-width:1180px){:root{--gpd:none;--gpm:flex;--gpfoot:1 / -1}}`,
    `@media(min-width:1181px){.gpMobOnly{display:none!important}}`,
    `@media(max-width:1180px){.gpDeskOnly{display:none!important}}`,
    ...hoverRules
  ].join('\n')

  return { html: body.trim(), css }
}

// Imagen de portada de marca por categoría (fallback cuando el post/proyecto no trae una)
const COVER_BY_CAT = {
  'Conversión': '/assets/svc-corp.jpg?v=2',
  'E-commerce': '/assets/svc-tienda.jpg?v=2',
  'Diseño': '/assets/stats-title.jpg',
  'Apps': '/assets/svc-app-crop.jpg',
  'Guías': '/assets/svc-landing-2.jpg',
  'Estrategia': '/assets/svc-corp.jpg?v=2',
  'Precios': '/assets/svc-landing-2.jpg'
}
const COVER_POOL = ['/assets/svc-landing-2.jpg', '/assets/svc-corp.jpg?v=2', '/assets/svc-tienda.jpg?v=2', '/assets/svc-app-crop.jpg', '/assets/stats-title.jpg', '/assets/contact-bg-2.jpg']
export function coverFor(cover, cat, i = 0) {
  if (cover) return cover
  return COVER_BY_CAT[cat] || COVER_POOL[i % COVER_POOL.length]
}
