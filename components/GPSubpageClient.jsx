'use client'

import { useEffect } from 'react'

// Interacciones compartidas de las subpáginas del diseño (blog, portafolio, post, proyecto):
// nav inteligente + píldora, reveal del hero, menú móvil, hover de tarjetas y filtro de categorías.
// Todo auto-detecta por selector: si un bloque no existe en la página, simplemente no hace nada.
export default function GPSubpageClient() {
  useEffect(() => {
    const D = []
    const on = (el, ev, fn, opt) => { if (!el) return; el.addEventListener(ev, fn, opt); D.push(() => el.removeEventListener(ev, fn, opt)) }
    const $ = (s, r = document) => r.querySelector(s)
    const $$ = (s, r = document) => [...r.querySelectorAll(s)]
    const retry = (fn, t = 250) => { const id = setTimeout(fn, t); D.push(() => clearTimeout(id)) }

    // ---- nav ----
    function initNav() {
      const nav = document.getElementById('gpNav'); if (!nav) return retry(initNav)
      let lastY = window.scrollY, ticking = false
      const upd = () => {
        const y = window.scrollY, d = y - lastY
        const hero = document.getElementById('gpHero'), inHero = hero && hero.getBoundingClientRect().bottom > nav.offsetHeight + 20
        nav.style.background = inHero ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,.8)'
        nav.style.backdropFilter = nav.style.webkitBackdropFilter = inHero ? 'none' : 'blur(16px) saturate(1.2)'
        if (y < 80 || d < -4) nav.style.transform = 'translateY(0)'
        else if (d > 4) nav.style.transform = 'translateY(calc(-100% - 24px))'
        if (Math.abs(d) > 4) lastY = y; ticking = false
      }
      const navScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd) } }
      on(window, 'scroll', navScroll, { passive: true })
      const links = $('[data-nav-links]', nav), pill = links && $('[data-nav-pill]', links)
      if (links && pill) {
        let shown = false
        $$('a', links).forEach(a => on(a, 'mouseenter', () => {
          const lr = links.getBoundingClientRect(), r = a.getBoundingClientRect()
          if (!shown) { pill.style.transition = 'none'; pill.style.transform = 'translate(' + (r.left - lr.left + r.width / 2) + 'px,' + (r.top - lr.top) + 'px)'; pill.style.width = '0px'; pill.style.height = r.height + 'px'; pill.offsetWidth; pill.style.transition = '' }
          pill.style.transform = 'translate(' + (r.left - lr.left) + 'px,' + (r.top - lr.top) + 'px)'
          pill.style.width = r.width + 'px'; pill.style.height = r.height + 'px'; pill.style.opacity = '1'; shown = true
        }))
        on(links, 'mouseleave', () => { pill.style.opacity = '0'; shown = false })
      }
      const spacer = nav.previousElementSibling
      const fit = () => { if (spacer && spacer.hasAttribute('data-nav-spacer')) spacer.style.height = (nav.offsetHeight + 40) + 'px' }
      const ro = new ResizeObserver(fit); ro.observe(nav); D.push(() => ro.disconnect()); fit(); upd()
    }

    // ---- reveal (hero words) ----
    function initReveal() {
      const root = $('[data-rv-root]'); if (!root) return
      $$('[data-rv-words]', root).forEach(p => {
        const walk = n => {
          [...n.childNodes].forEach(c => {
            if (c.nodeType === 3 && c.textContent.trim()) {
              const f = document.createDocumentFragment()
              c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) f.appendChild(document.createTextNode(w)); else { const s = document.createElement('span'); s.setAttribute('data-rv', ''); s.style.display = 'inline-block'; s.textContent = w; f.appendChild(s) } })
              c.replaceWith(f)
            } else if (c.nodeType === 1 && !c.hasAttribute('data-rv')) walk(c)
          })
        }
        walk(p)
      })
      const els = $$('[data-rv]', root)
      els.forEach(el => { if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block'; el.style.opacity = '0'; el.style.filter = 'blur(18px)'; el.style.transform = 'translateY(.35em) scale(.96)'; el.style.willChange = 'filter,opacity,transform' })
      const show = () => els.forEach((el, i) => { const d = 0.08 + i * 0.07; el.style.transition = 'opacity .8s ease ' + d + 's, filter 1.1s cubic-bezier(.2,.8,.2,1) ' + d + 's, transform 1.1s cubic-bezier(.2,.8,.2,1) ' + d + 's'; el.style.opacity = '1'; el.style.filter = 'blur(0px)'; el.style.transform = 'none' })
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { show(); io.disconnect() } }, { threshold: 0.3 })
      io.observe(root); D.push(() => io.disconnect())
    }

    // ---- menú móvil ----
    function initMenu() {
      const menu = document.getElementById('gpMenu'); if (!menu) return
      const set = v => { menu.style.opacity = v ? '1' : '0'; menu.style.transform = 'scale(' + (v ? 1 : .96) + ')'; menu.style.pointerEvents = v ? 'auto' : 'none'; document.documentElement.style.overflow = v ? 'hidden' : '' }
      $$('[data-gp="menuOpen"]').forEach(b => on(b, 'click', () => set(true)))
      $$('[data-gp="menuClose"]').forEach(b => on(b, 'click', () => set(false)))
    }

    // ---- hover de tarjetas (.gpHoverCard): detecta estilo blog vs portafolio (clip-path) ----
    function initCardHover() {
      $$('.gpHoverCard').forEach(a => {
        const card = a.children[0]; if (!card || card.children.length < 4) return
        const overlay = card.children[4]
        const isPf = overlay && /circle/.test((overlay.style.clipPath || '') + (overlay.getAttribute('style') || ''))
        if (isPf) {
          // portafolio: reveal con clip-path circle
          const scaleWrap = card.children[0]
          const rc0 = overlay.children[0], rc1 = overlay.children[1]
          const set = en => {
            if (scaleWrap) scaleWrap.style.transform = en ? 'scale(1.05)' : 'scale(1)'
            overlay.style.clipPath = en ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)'
            if (rc0) { rc0.style.opacity = en ? '1' : '0'; rc0.style.filter = en ? 'blur(0px)' : 'blur(10px)'; rc0.style.transform = en ? 'translateY(0px)' : 'translateY(14px)' }
            if (rc1) rc1.style.opacity = en ? '1' : '0'
          }
          on(a, 'mouseenter', () => set(true)); on(a, 'mouseleave', () => set(false))
        } else {
          // blog: imagen + reveal de texto
          const bg = card.children[0], grad = card.children[3], txt = card.children[4], title = a.children[2]
          const set = en => {
            if (bg) bg.style.transform = en ? 'scale(1.05)' : 'scale(1)'
            if (grad) grad.style.opacity = en ? '1' : '0'
            if (txt) { txt.style.opacity = en ? '1' : '0'; txt.style.filter = en ? 'blur(0px)' : 'blur(10px)'; txt.style.transform = en ? 'translateY(0px)' : 'translateY(14px)' }
            if (title) title.style.fontWeight = en ? '600' : '400'
          }
          on(a, 'mouseenter', () => set(true)); on(a, 'mouseleave', () => set(false))
        }
      })
    }

    // ---- filtro de categorías (blog) ----
    function initFilter() {
      const btns = $$('[data-gp-pick][data-cat]'); if (!btns.length) return
      const cards = $$('.gpHoverCard[data-cat]')
      const setActive = (label) => {
        btns.forEach(b => {
          const on = b.getAttribute('data-cat') === label
          b.style.background = on ? '#D4FF00' : 'transparent'
          b.style.borderColor = on ? '#D4FF00' : 'rgba(13,13,13,.25)'
          b.style.fontWeight = on ? '600' : '400'
        })
        cards.forEach(c => { c.style.display = (label === 'Todos' || c.getAttribute('data-cat') === label) ? '' : 'none' })
      }
      btns.forEach(b => on(b, 'click', () => setActive(b.getAttribute('data-cat'))))
    }

    // ---- "ver más" ----
    function initLoadMore() {
      const btn = $('[data-gp="loadMore"]'); if (!btn) return
      on(btn, 'click', () => { $$('.gpHiddenMore').forEach(c => c.classList.remove('gpHiddenMore')); btn.style.display = 'none' })
    }

    // ---- medidores (gauges del caso de proyecto) ----
    function initGauges() {
      const rings = $$('circle[data-gauge]'); if (!rings.length) return
      const C = 326.73 // 2π·52
      const run = (ring) => {
        const target = +ring.getAttribute('data-gauge')
        ring.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)'
        ring.style.strokeDashoffset = C * (1 - target / 100)
        const svg = ring.closest('svg'); const num = svg && svg.nextElementSibling
        if (num && num.hasAttribute('data-gauge-n')) {
          const t = +num.getAttribute('data-gauge-n'), t0 = performance.now(), DUR = 1300
          const tick = (now) => { const p = Math.min(1, (now - t0) / DUR); num.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick) }
          requestAnimationFrame(tick)
        }
      }
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target) } }), { threshold: 0.4 })
      rings.forEach((r) => io.observe(r)); D.push(() => io.disconnect())
    }

    initNav(); initReveal(); initMenu(); initCardHover(); initFilter(); initLoadMore(); initGauges()
    return () => { D.forEach(fn => { try { fn() } catch (e) {} }); document.documentElement.style.overflow = '' }
  }, [])

  return null
}
