import LandingGP from '../components/LandingGP'
import LANDING_HTML from '../components/landingHtml'
import { getAllProjects } from '../lib/projects'
import { getAllPosts, fmtMonthYear } from '../lib/posts'
import { coverFor } from '../lib/dcEngine'

export const metadata = {
  title: 'Webs y apps que venden',
  description:
    'Diseñamos landing pages, webs corporativas, tiendas online y apps que se ven premium y están hechas para vender. Rápido, claro y con precios desde el inicio. Venezuela & Latam.',
  alternates: { canonical: '/' }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default function Home() {
  const projects = getAllProjects()

  // ---- carrusel pinneado (desktop): lista de nombres + track de imágenes ----
  const names = projects.map((p) => `
    <div data-pf-name="" style="display:flex;flex-direction:column;gap:6px;transition:opacity .4s ease">
      <span style="font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(243,242,242,.6)">(${esc(p.category)})</span>
      <span data-pf-title="" style="font-size:clamp(36px,4.4vw,64px);font-weight:500;letter-spacing:-.04em;line-height:1;color:#F3F2F2;transition:color .4s ease">${esc(p.title)}</span>
    </div>`).join('')

  const track = projects.map((p, i) => {
    const cover = coverFor(p.cover, p.category, i)
    return `
    <a href="/proyectos/${p.slug}" style="display:block;color:#0D0D0D;text-decoration:none">
      <div data-pf-img="" style="position:relative;flex:none;height:var(--pf-h);border-radius:18px;overflow:hidden;background:#1E1E1E">
        <div style="position:absolute;inset:0;background-image:url(${cover});background-size:cover;background-position:center"></div>
        <div data-pf-ov="" style="position:absolute;inset:0;z-index:2;background:#D4FF00;color:#0D0D0D;padding:clamp(24px,2.6vw,40px);display:flex;flex-direction:column;justify-content:space-between;gap:24px;pointer-events:none;clip-path:circle(0px at 50% 50%)">
          <div style="font-family:'Outfit',sans-serif;font-size:clamp(28px,2.8vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.02;max-width:16ch;text-wrap:balance">${esc(p.title)}: ver el caso completo</div>
          <div style="font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase">(${esc(p.category)})</div>
        </div>
        <span style="position:absolute;right:18px;bottom:18px;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(13,13,13,.45);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#FFFFFF;font-size:15px;font-weight:500;pointer-events:none">${esc(p.category)}</span>
      </div>
    </a>`
  }).join('')

  // ---- grid móvil: tarjetas con reveal clip-path (gpPfmCard) ----
  const mobile = projects.map((p, i) => {
    const cover = coverFor(p.cover, p.category, i)
    const result = (p.results && p.results[0] && p.results[0].value) || ''
    const tags = (p.services && p.services.length ? p.services.slice(0, 3) : [p.category]).filter(Boolean)
    const tagsHtml = tags.map((t) => `<span style="font-size:14px;font-weight:500;color:#FFFFFF;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)">${esc(t)}</span>`).join('')
    return `
    <a href="/proyectos/${p.slug}" class="gpPfmCard" style="display:block;color:#0D0D0D;text-decoration:none">
      <div style="position:relative;aspect-ratio:1/1;border-radius:24px;overflow:hidden;background:#1E1E1E">
        <div style="position:absolute;inset:0;transform:scale(1);transition:transform .6s cubic-bezier(.2,.8,.2,1)"><div style="position:absolute;inset:0;background-image:url(${cover});background-size:cover;background-position:center"></div></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,13,.55) 0%,rgba(13,13,13,0) 38%,rgba(13,13,13,0) 68%,rgba(13,13,13,.5) 100%);pointer-events:none"></div>
        <div style="position:absolute;top:clamp(20px,2.2vw,28px);left:clamp(20px,2.2vw,28px);right:clamp(20px,2.2vw,28px);font-size:clamp(26px,2.4vw,36px);font-weight:700;letter-spacing:-.03em;line-height:1;color:#FFFFFF;pointer-events:none">${esc(p.title)}</div>
        <div style="position:absolute;left:clamp(16px,1.8vw,22px);right:clamp(16px,1.8vw,22px);bottom:clamp(16px,1.8vw,22px);display:flex;gap:8px;flex-wrap:wrap;pointer-events:none">${tagsHtml}</div>
        <div style="position:absolute;inset:0;z-index:2;background:#D4FF00;color:#0D0D0D;padding:clamp(22px,2.4vw,32px);display:flex;flex-direction:column;justify-content:space-between;gap:20px;pointer-events:none;clip-path:circle(0% at 50% 50%);transition:clip-path .7s cubic-bezier(.65,0,.25,1)">
          <div style="display:flex;flex-direction:column;gap:14px;opacity:0;filter:blur(10px);transform:translateY(14px);transition:opacity .5s ease .2s,filter .6s ease .2s,transform .6s cubic-bezier(.2,.8,.2,1) .2s">
            <div style="font-size:clamp(26px,2.4vw,36px);font-weight:700;letter-spacing:-.03em;line-height:1">${esc(p.title)}</div>
            <div style="font-size:16px;line-height:1.5;max-width:36ch;text-wrap:pretty">${esc(p.summary)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;opacity:0;transition:opacity .5s ease .25s">
            <div style="font-size:clamp(28px,2.6vw,40px);font-weight:700;letter-spacing:-.03em;line-height:1">${esc(result)}</div>
            <span style="display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600">Ver caso <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg></span>
          </div>
        </div>
      </div>
    </a>`
  }).join('')

  // ---- sección Blog del home: 3 posts reales, cada tarjeta enlaza a su artículo ----
  const blogCards = getAllPosts().slice(0, 3).map((p, i) => {
    const cat = (p.tags && p.tags[0]) || 'Artículo'
    const img = coverFor(p.cover, cat, i)
    return `
    <a href="/blog/${p.slug}" class="gpBlogCard" style="display:flex;flex-direction:column;gap:16px;color:#0D0D0D;text-decoration:none">
      <div style="position:relative;aspect-ratio:1/1;border-radius:24px;overflow:hidden;background:#DCDCD3">
        <div style="position:absolute;inset:0;background-image:url(${img});background-size:cover;background-position:center;filter:blur(0px);transform:scale(1);transition:filter .45s ease,transform .6s cubic-bezier(.2,.8,.2,1)"></div>
        <div style="position:absolute;inset:0;background:rgba(243,242,242,0);transition:background .45s ease"></div>
        <span style="position:absolute;top:16px;left:16px;font-size:13px;font-weight:500;color:#FFFFFF;padding:5px 12px;border-radius:999px;background:rgba(13,13,13,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)">${esc(cat)}</span>
        <div style="position:absolute;left:0;right:0;bottom:0;height:75%;pointer-events:none;opacity:0;transition:opacity .5s ease">
          <div style="position:absolute;inset:0;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);-webkit-mask-image:linear-gradient(to top,#000 0%,transparent 100%);mask-image:linear-gradient(to top,#000 0%,transparent 100%)"></div>
          <div style="position:absolute;inset:0;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);-webkit-mask-image:linear-gradient(to top,#000 0%,#000 30%,transparent 70%);mask-image:linear-gradient(to top,#000 0%,#000 30%,transparent 70%)"></div>
          <div style="position:absolute;inset:0;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);-webkit-mask-image:linear-gradient(to top,#000 0%,#000 25%,transparent 50%);mask-image:linear-gradient(to top,#000 0%,#000 25%,transparent 50%)"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,13,.72) 0%,rgba(13,13,13,.4) 45%,rgba(13,13,13,0) 100%)"></div>
        </div>
        <div style="position:absolute;left:clamp(18px,2vw,24px);right:clamp(18px,2vw,24px);bottom:clamp(18px,2vw,24px);display:flex;flex-direction:column;gap:14px;color:#FFFFFF;pointer-events:none;opacity:0;filter:blur(10px);transform:translateY(14px);transition:opacity .5s ease .05s,filter .6s ease .05s,transform .6s cubic-bezier(.2,.8,.2,1) .05s">
          <div style="font-size:16px;line-height:1.5;text-wrap:pretty">${esc(p.description)}</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600">Leer artículo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <span style="display:flex;align-items:center;gap:8px;font-size:13px;color:#3A3836;padding:4px 12px 4px 4px;border-radius:999px;background:#FFFFFF"><span style="width:22px;height:22px;border-radius:999px;background:#0D0D0D;color:#D4FF00;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">JM</span>${esc(p.author || 'José Mobresú')}</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:13px;color:#3A3836;padding:4px 12px;border-radius:999px;background:#FFFFFF"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>${esc(fmtMonthYear(p.date))}</span>
      </div>
      <div style="font-size:clamp(19px,1.5vw,22px);font-weight:400;letter-spacing:-.015em;line-height:1.25;text-wrap:pretty;transition:font-weight .3s ease">${esc(p.title)}</div>
    </a>`
  }).join('')

  const html = LANDING_HTML
    .replace('<!--PF_NAMES-->', names)
    .replace('<!--PF_TRACK-->', track)
    .replace('<!--PF_MOBILE-->', mobile)
    .replace('<!--BLOG_POSTS-->', blogCards)

  return <LandingGP html={html} />
}
