'use client'

import { useState } from 'react'
import { PSI_API_KEY, WEB3FORMS_KEY } from '../lib/siteConfig'

const INK = '#0D0D0D', PAPER = '#F3F2F2', GREEN = '#D4FF00'
const GOOD = '#16A34A', MID = '#E0960B', BAD = '#DC2626'
const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, hice la auditoría de mi web y quiero mejorarla.')

const colorFor = (s) => (s >= 90 ? GOOD : s >= 50 ? MID : BAD)
const labelFor = (s) => (s >= 90 ? 'Bien' : s >= 50 ? 'Mejorable' : 'Crítico')

const MB = 1048576
const fmtBytes = (n) => {
  if (!n || n < 1024) return (Math.round(n) || 0) + ' B'
  const kb = n / 1024
  if (kb < 1024) return Math.round(kb) + ' KB'
  const mb = kb / 1024
  return (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + ' MB'
}

const WEIGHT_CATS = [
  { key: 'image', label: 'Imágenes', color: '#16A34A' },
  { key: 'media', label: 'Video', color: '#E0960B' },
  { key: 'code', label: 'Código (JS/CSS)', color: '#0D0D0D' },
  { key: 'font', label: 'Fuentes', color: '#8A8A86' },
  { key: 'other', label: 'Otros', color: '#CBCAC6' }
]

// Desglosa el peso de la página (bytes transferidos) por tipo, desde Lighthouse.
function buildWeight(a) {
  const rs = a['resource-summary']?.details?.items || []
  if (!rs.length) return null
  const by = {}
  rs.forEach((i) => { by[i.resourceType] = i.transferSize || 0 })
  const total = by.total || a['total-byte-weight']?.numericValue || 0
  if (!total) return null
  const groups = {
    image: by.image || 0,
    media: by.media || 0,
    code: (by.script || 0) + (by.stylesheet || 0),
    font: by.font || 0,
    other: Math.max(0, (by.document || 0) + (by.other || 0))
  }
  const sav = (id) => a[id]?.details?.overallSavingsBytes || 0
  const imgSavings = sav('uses-optimized-images') + sav('modern-image-formats') + sav('uses-responsive-images') + sav('offscreen-images')
  const vidSavings = sav('efficient-animated-content')
  return { total, groups, imgSavings, vidSavings }
}

// Recomendaciones en lenguaje claro según el peso.
function weightRecs(w) {
  const recs = []
  const totalMB = w.total / MB
  const imgShare = w.total ? w.groups.image / w.total : 0
  if (totalMB > 4) recs.push({ t: 'Tu página pesa de más', d: `Son ${fmtBytes(w.total)} y eso se siente en móvil. Una web rápida suele quedar por debajo de 2 MB.` })
  else if (totalMB > 2.5) recs.push({ t: 'Hay margen para aligerar', d: `La página pesa ${fmtBytes(w.total)}; se puede recortar bastante para cargar más rápido en celulares.` })
  if (w.groups.image > 1.2 * MB || imgShare > 0.45) {
    const ahorro = w.imgSavings > 50 * 1024 ? ` Podrías ahorrar ~${fmtBytes(w.imgSavings)} comprimiéndolas y usando WebP/AVIF.` : ' Comprimirlas y usar formatos modernos (WebP/AVIF) las aligera mucho.'
    recs.push({ t: 'Las imágenes mandan en el peso', d: `Son el ${Math.round(imgShare * 100)}% del total (${fmtBytes(w.groups.image)}).${ahorro}` })
  }
  if (w.groups.media > 1.5 * MB) {
    recs.push({ t: 'Los videos pesan mucho', d: `Suman ${fmtBytes(w.groups.media)}. Conviene comprimirlos, mostrar una imagen de portada mientras cargan y cargarlos solo al verse — o servirlos desde un reproductor (YouTube, Vimeo o Cloudflare Stream).` })
  }
  if (!recs.length) recs.push({ t: '¡Buen peso!', d: `La página pesa ${fmtBytes(w.total)} y está bien balanceada. Mantenla así al sumar contenido.` })
  return recs
}

function WeightPanel({ w }) {
  if (!w) return null
  const segs = WEIGHT_CATS.map((c) => ({ ...c, bytes: w.groups[c.key] || 0 })).filter((s) => s.bytes > 0)
  const total = w.total || segs.reduce((n, s) => n + s.bytes, 0)
  if (!total) return null
  const recs = weightRecs(w)
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <h3 style={{ fontSize: 'clamp(20px,2.2vw,30px)', fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>Peso de la página</h3>
        <div style={{ fontSize: 15, color: '#6B6A66' }}>Total: <strong style={{ color: INK }}>{fmtBytes(total)}</strong></div>
      </div>
      <div style={{ display: 'flex', height: 18, borderRadius: 999, overflow: 'hidden', background: '#E4E3DF' }}>
        {segs.map((s) => <div key={s.key} title={`${s.label}: ${fmtBytes(s.bytes)}`} style={{ width: (s.bytes / total * 100) + '%', background: s.color }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginTop: 18 }}>
        {segs.map((s) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: s.color, flex: 'none' }} />
            <div>
              <div style={{ fontSize: 14, color: '#3A3836' }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>{fmtBytes(s.bytes)} <span style={{ fontSize: 13, fontWeight: 500, color: '#8a8a86' }}>· {Math.round(s.bytes / total * 100)}%</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        {recs.map((r, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{r.t}</div>
            <div style={{ fontSize: 15, color: '#3A3836', marginTop: 4, lineHeight: 1.5 }}>{r.d}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Ring({ score, size = 168, stroke = 14, big }) {
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const col = colorFor(score)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(13,13,13,.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: big ? 52 : 34, fontWeight: 700, letterSpacing: '-.03em', color: col, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: col }}>{labelFor(score)}</div>
      </div>
    </div>
  )
}

export default function AuditaClient() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const [email, setEmail] = useState('')
  const [leadState, setLeadState] = useState('idle') // idle | sending | sent

  const normalize = (v) => {
    let u = v.trim()
    if (!u) return ''
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    return u
  }

  async function run(e) {
    e.preventDefault()
    const target = normalize(url)
    if (!/^https?:\/\/[^\s.]+\.[^\s]+$/.test(target)) { setErr('Escribe una dirección válida, por ejemplo tusitio.com'); setState('error'); return }
    setState('loading'); setErr(''); setData(null); setLeadState('idle')
    try {
      const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(target) +
        '&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices' +
        (PSI_API_KEY ? '&key=' + PSI_API_KEY : '')
      const res = await fetch(api)
      const json = await res.json()
      if (!res.ok || !json.lighthouseResult) {
        const raw = json.error?.message || ''
        if (/quota|rate limit|rateLimit/i.test(raw)) throw new Error('Estamos recibiendo muchas solicitudes ahora mismo. Vuelve a intentarlo en un minuto.')
        if (/Unable to|fetch|Lighthouse returned|FAILED_DOCUMENT_REQUEST|DNS|ERRORED_DOCUMENT/i.test(raw)) throw new Error('No pudimos cargar esa página. Revisa que la dirección sea correcta y esté en línea.')
        throw new Error('No pudimos analizar esa página. Prueba con otra dirección.')
      }
      const lh = json.lighthouseResult
      const cat = lh.categories, a = lh.audits
      const pct = (x) => Math.round((x?.score ?? 0) * 100)
      setData({
        url: target,
        scores: { velocidad: pct(cat.performance), seo: pct(cat.seo), accesibilidad: pct(cat.accessibility), practicas: pct(cat['best-practices']) },
        metrics: [
          { k: 'Carga del contenido (LCP)', v: a['largest-contentful-paint']?.displayValue || '—', s: pct({ score: a['largest-contentful-paint']?.score }) },
          { k: 'Estabilidad visual (CLS)', v: a['cumulative-layout-shift']?.displayValue || '—', s: pct({ score: a['cumulative-layout-shift']?.score }) },
          { k: 'Primer contenido (FCP)', v: a['first-contentful-paint']?.displayValue || '—', s: pct({ score: a['first-contentful-paint']?.score }) },
          { k: 'Tiempo bloqueado (TBT)', v: a['total-blocking-time']?.displayValue || '—', s: pct({ score: a['total-blocking-time']?.score }) }
        ],
        weight: buildWeight(a)
      })
      setState('done')
    } catch (e2) {
      setErr(e2.message || 'Algo salió mal. Inténtalo de nuevo.'); setState('error')
    }
  }

  async function sendLead(e) {
    e.preventDefault()
    if (!WEB3FORMS_KEY || !data) return
    setLeadState('sending')
    try {
      const fd = new FormData()
      fd.append('access_key', WEB3FORMS_KEY)
      fd.append('subject', 'Nueva auditoría web — lead')
      fd.append('from_name', 'Greenpop · Auditoría')
      fd.append('email', email)
      fd.append('sitio_auditado', data.url)
      fd.append('resultados', `Velocidad ${data.scores.velocidad} · SEO ${data.scores.seo} · Accesibilidad ${data.scores.accesibilidad} · Buenas prácticas ${data.scores.practicas}`)
      if (data.weight) fd.append('peso', `Total ${fmtBytes(data.weight.total)} · Imágenes ${fmtBytes(data.weight.groups.image)} · Video ${fmtBytes(data.weight.groups.media)}`)
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      if (!r.ok) throw new Error()
      setLeadState('sent')
    } catch { setLeadState('idle'); alert('No pudimos enviarlo ahora. Escríbenos por WhatsApp.') }
  }

  const verdict = (s) => s >= 90
    ? 'Tu web va muy bien. Afinando detalles puede convertir aún más.'
    : s >= 50
      ? 'Tu web tiene margen de mejora. Cada segundo y cada punto se traduce en ventas.'
      : 'Tu web está frenando tus ventas: carga lenta y problemas que espantan clientes. Se puede arreglar.'

  const fieldBox = { fontSize: 17, padding: '16px 20px', border: '1px solid #E4E3DF', background: '#fff', color: INK, borderRadius: 14, boxSizing: 'border-box', width: '100%', fontFamily: 'inherit' }
  const pill = (bg, fg) => ({ display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color: fg, padding: '14px 24px', borderRadius: 999, fontWeight: 600, fontSize: 16, textDecoration: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' })

  return (
    <section style={{ color: INK, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(16px,3vw,40px) clamp(20px,4vw,48px) clamp(64px,8vw,104px)' }}>
        {/* hero / input */}
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#3A3836' }}>Auditoría gratis</div>
        <h1 style={{ fontSize: 'clamp(38px,6vw,76px)', lineHeight: .98, letterSpacing: '-.04em', margin: '14px 0 16px', fontWeight: 700 }}>
          ¿Tu web vende?<br /><span style={{ fontWeight: 300 }}>Descúbrelo en segundos.</span>
        </h1>
        <p style={{ fontSize: 'clamp(17px,1.6vw,20px)', color: '#3A3836', maxWidth: 560, lineHeight: 1.5 }}>
          Analizamos <strong>velocidad, SEO y experiencia</strong> de tu sitio con datos reales de Google. Sin registro.
        </p>

        <form onSubmit={run} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28, maxWidth: 620 }}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="tusitio.com" aria-label="URL de tu sitio"
            style={{ ...fieldBox, flex: '1 1 260px' }} />
          <button type="submit" disabled={state === 'loading'} style={{ ...pill(INK, PAPER), padding: '16px 28px', opacity: state === 'loading' ? .6 : 1 }}>
            {state === 'loading' ? 'Analizando…' : 'Auditar gratis'}
          </button>
        </form>

        {state === 'error' && <div style={{ marginTop: 18, color: BAD, fontWeight: 500 }}>{err}</div>}
        {state === 'loading' && <div style={{ marginTop: 28, color: '#3A3836' }}>Analizando tu web con Google PageSpeed… suele tardar 15–30&nbsp;segundos.</div>}

        {/* resultados */}
        {state === 'done' && data && (
          <div style={{ marginTop: 44 }}>
            <div style={{ fontSize: 14, color: '#6B6A66', wordBreak: 'break-all' }}>Resultados de <strong style={{ color: INK }}>{data.url}</strong></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px,4vw,48px)', flexWrap: 'wrap', margin: '24px 0 8px' }}>
              <div style={{ textAlign: 'center' }}>
                <Ring score={data.scores.velocidad} big />
                <div style={{ marginTop: 10, fontWeight: 600, fontSize: 18 }}>Velocidad</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 20, flex: '1 1 300px' }}>
                {[['SEO', data.scores.seo], ['Accesibilidad', data.scores.accesibilidad], ['Buenas prácticas', data.scores.practicas]].map(([lbl, sc]) => (
                  <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Ring score={sc} size={104} stroke={10} />
                    <div style={{ fontWeight: 600, fontSize: 15, textAlign: 'center' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 'clamp(18px,1.8vw,22px)', lineHeight: 1.5, margin: '20px 0 28px', fontWeight: 400 }}>{verdict(data.scores.velocidad)}</p>

            {/* métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
              {data.metrics.map((m) => (
                <div key={m.k} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#6B6A66' }}>{m.k}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>{m.v}</div>
                  </div>
                  <span style={{ width: 12, height: 12, borderRadius: 999, background: colorFor(m.s), flex: 'none' }} />
                </div>
              ))}
            </div>

            {/* peso de la página */}
            <WeightPanel w={data.weight} />

            {/* CTA */}
            <div style={{ background: INK, color: PAPER, borderRadius: 24, padding: 'clamp(28px,4vw,44px)', marginTop: 36 }}>
              <div style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05 }}>¿La arreglamos?</div>
              <div style={{ fontSize: 18, color: 'rgba(243,242,242,.8)', margin: '10px 0 22px', maxWidth: 520 }}>Convertimos estos números en ventas. La primera llamada es gratis.</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: leadState === 'sent' ? 0 : 26 }}>
                <a href="/#contacto" style={pill(GREEN, INK)}>Agenda una llamada gratis</a>
                <a href={WA} target="_blank" rel="noopener" style={{ ...pill('transparent', PAPER), border: '1.5px solid rgba(243,242,242,.5)' }}>WhatsApp</a>
              </div>

              {WEB3FORMS_KEY && leadState !== 'sent' && (
                <form onSubmit={sendLead} style={{ borderTop: '1px solid rgba(243,242,242,.18)', paddingTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ width: '100%', fontSize: 15, color: 'rgba(243,242,242,.8)' }}>¿Quieres el informe completo con recomendaciones? Déjanos tu correo:</div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                    style={{ ...fieldBox, flex: '1 1 240px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(243,242,242,.25)', color: PAPER }} />
                  <button type="submit" disabled={leadState === 'sending'} style={{ ...pill(GREEN, INK), opacity: leadState === 'sending' ? .6 : 1 }}>
                    {leadState === 'sending' ? 'Enviando…' : 'Enviar'}
                  </button>
                </form>
              )}
              {leadState === 'sent' && <div style={{ marginTop: 22, fontSize: 17, fontWeight: 600, color: GREEN }}>¡Listo! Te escribimos con el informe y las mejoras.</div>}
            </div>

            <div style={{ marginTop: 20, fontSize: 13, color: '#8a8a86' }}>Datos de Google PageSpeed Insights (Lighthouse), estrategia móvil.</div>
          </div>
        )}
      </div>
    </section>
  )
}
