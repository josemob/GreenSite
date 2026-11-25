'use client'

import { useState } from 'react'
import { PSI_API_KEY, WEB3FORMS_KEY } from '../lib/siteConfig'

const INK = '#0D0D0D', PAPER = '#F3F2F2', GREEN = '#D4FF00'
const GOOD = '#16A34A', MID = '#E0960B', BAD = '#DC2626'
const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, hice la auditoría de mi web y quiero mejorarla.')

const colorFor = (s) => (s >= 90 ? GOOD : s >= 50 ? MID : BAD)
const labelFor = (s) => (s >= 90 ? 'Bien' : s >= 50 ? 'Mejorable' : 'Crítico')

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
        ]
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
