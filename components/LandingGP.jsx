'use client'

import { useEffect } from 'react'

export default function LandingGP({ html }) {
  useEffect(() => {
    const D = [] // disposers
    const on = (el, ev, fn, opt) => { if (!el) return; el.addEventListener(ev, fn, opt); D.push(() => el.removeEventListener(ev, fn, opt)) }
    const $ = (s, r = document) => r.querySelector(s)
    const $$ = (s, r = document) => [...r.querySelectorAll(s)]
    const retry = (fn, t = 300) => { const id = setTimeout(fn, t); D.push(() => clearTimeout(id)) }
    let rafs = []
    const RAF = (fn) => { const id = requestAnimationFrame(fn); rafs.push(id); return id }

    // ---- mute all videos ----
    const muteAll = () => $$('video').forEach(v => { v.muted = true; v.defaultMuted = true; v.volume = 0; v.setAttribute('muted', '') })
    muteAll()
    const muteMO = new MutationObserver(muteAll); muteMO.observe(document.body, { childList: true, subtree: true }); D.push(() => muteMO.disconnect())
    on(document, 'volumechange', e => { if (e.target.tagName === 'VIDEO' && !e.target.muted) e.target.muted = true }, true)

    // ---- stat hover ----
    function initStatHover() {
      const cells = $$('[data-stat-cell]')
      if (cells.length < 2) return retry(initStatHover)
      if (!matchMedia('(hover:hover)').matches) return
      cells.forEach(cell => {
        const ov = $('[data-stat-ov]', cell)
        const go = (e, open) => {
          const r = cell.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, R = Math.hypot(r.width, r.height) + 20
          ov.style.transition = 'none'; ov.style.clipPath = 'circle(' + (open ? 0 : R) + 'px at ' + x + 'px ' + y + 'px)'; ov.offsetWidth
          ov.style.transition = 'clip-path ' + (open ? '.6s' : '.5s') + ' cubic-bezier(.65,0,.25,1)'
          ov.style.clipPath = 'circle(' + (open ? R : 0) + 'px at ' + x + 'px ' + y + 'px)'
        }
        on(cell, 'mouseenter', e => go(e, true)); on(cell, 'mouseleave', e => go(e, false))
      })
    }

    // ---- lemon title ----
    function initLemonTitle() {
      const v = $('video[data-lemon-title]'); if (!v) return retry(initLemonTitle)
      v.muted = true; v.loop = true; v.playsInline = true
      on(v, 'ended', () => { v.currentTime = 0; v.play().catch(() => {}) })
      v.play().catch(() => {})
    }

    // ---- nav ----
    function initNav() {
      const nav = document.getElementById('gpNav'); if (!nav) return retry(initNav, 200)
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
      const navScroll = () => { if (!ticking) { ticking = true; RAF(upd) } }
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
      // escritorio: hero full-bleed centrado bajo el nav (spacer 0).
      // móvil: hero apilado -> el spacer empuja el título bajo el nav.
      const fit = () => { if (spacer && spacer.hasAttribute('data-nav-spacer')) spacer.style.height = (window.innerWidth <= 1180 ? nav.offsetHeight + 16 : 0) + 'px' }
      const navRO = new ResizeObserver(fit); navRO.observe(nav); D.push(() => navRO.disconnect())
      on(window, 'resize', fit); fit()
      upd()
    }

    // ---- reveal (impacto) ----
    function initReveal() {
      const root = $('[data-rv-root]'); if (!root) return retry(initReveal)
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
      els.forEach(el => { if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block'; el.style.opacity = '0'; el.style.filter = 'blur(14px)'; el.style.transform = 'translateY(.25em)'; el.style.willChange = 'filter,opacity,transform' })
      const show = () => els.forEach((el, i) => { el.style.transition = 'opacity .9s ease ' + (i * 0.06) + 's, filter 1s ease ' + (i * 0.06) + 's, transform 1s cubic-bezier(.2,.8,.2,1) ' + (i * 0.06) + 's'; el.style.opacity = '1'; el.style.filter = 'blur(0px)'; el.style.transform = 'none' })
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { show(); io.disconnect() } }, { threshold: 0.3 })
      io.observe(root); D.push(() => io.disconnect())
    }

    // ---- hero video (time of day) ----
    function heroKey() {
      const t = new Date().getHours() + new Date().getMinutes() / 60
      return t >= 5 && t < 11 ? 'manana' : t >= 11 && t < 16 ? 'mediodia' : t >= 16 && t < 19.5 ? 'atardecer' : 'noche'
    }
    let blobUrl, loadedSrc
    async function loadVideo() {
      const key = heroKey()
      const src = '/assets/hero-' + key + '.mp4'
      if (src === loadedSrc) return; loadedSrc = src
      const v = document.getElementById('gpHeroVideo'); if (!v) return retry(loadVideo)
      v.poster = '/assets/hero-' + key + '.jpg'
      v.loop = true; v.muted = true; v.playsInline = true
      v.onended = () => { v.currentTime = 0; v.play().catch(() => {}) }
      try { const blob = await (await fetch(src)).blob(); if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = URL.createObjectURL(blob); v.src = blobUrl }
      catch (e) { v.src = src }
      v.play().catch(() => {})
    }

    // ---- proceso secuencial ----
    let seqRaf, seqIO, seqMT, seqVs
    function initSeq() {
      const vs = [1, 2, 3].map(i => $('video[data-seq="' + i + '"]'))
      if (vs.some(v => !v)) return retry(initSeq)
      seqVs = vs
      const ov = i => $('[data-seq-ov="' + (i + 1) + '"]')
      let seqCur = 0
      const start = i => {
        seqCur = i
        vs.forEach((x, j) => { const o = ov(j); if (o) o.style.opacity = j === i ? '0' : '1'; if (j !== i) x.pause() })
        vs[i].currentTime = 0; vs[i].play().catch(() => {})
      }
      const isMob = () => window.innerWidth < 768
      vs.forEach((v, i) => { v.muted = true; v.loop = false; v.onended = () => { if (isMob()) { const o = ov(i); if (o) o.style.opacity = '1'; return } start((i + 1) % vs.length) } })
      const bars = [1, 2, 3].map(i => $('[data-seq-bar="' + i + '"]'))
      const loop = () => {
        const c = seqCur, m = isMob()
        vs.forEach((v, i) => { const b = bars[i]; if (!b) return; const p = m ? (v.duration ? v.currentTime / v.duration : 0) : i < c ? 1 : i > c ? 0 : (v.duration ? v.currentTime / v.duration : 0); b.style.width = (p * 100) + '%' })
        seqRaf = requestAnimationFrame(loop)
      }
      loop()
      let begun = false
      const io = new IntersectionObserver(es => {
        if (isMob()) return
        const vis = es.some(e => e.isIntersecting)
        if (vis && !begun) { begun = true; start(0) }
        else if (vis) { vs[seqCur].play().catch(() => {}) }
        else if (begun) { vs[seqCur].pause() }
      }, { threshold: 0.35 })
      const proceso = document.getElementById('proceso'); if (proceso) io.observe(proceso)
      const mState = {}
      const mCheck = () => {
        if (!isMob()) return
        const vh = window.innerHeight
        ;[1, 2, 3].forEach(n => {
          const v = $('video[data-seq="' + n + '"]'), o = $('[data-seq-ov="' + n + '"]'); if (!v) return
          const r = v.getBoundingClientRect()
          const vis = r.height > 0 ? Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height : 0
          const onv = vis >= 0.6
          if (onv && mState[n] !== true) { mState[n] = true; if (o) o.style.opacity = '0'; v.muted = true; v.currentTime = 0; v.play().catch(() => {}) }
          else if (!onv && vis < 0.1 && mState[n] !== false) { mState[n] = false; v.pause(); v.currentTime = 0; if (o) o.style.opacity = '1' }
        })
      }
      const mScroll = () => requestAnimationFrame(mCheck)
      on(window, 'scroll', mScroll, { passive: true }); on(window, 'resize', mScroll)
      seqMT = setInterval(mCheck, 500); mCheck()
      seqIO = { disconnect: () => { io.disconnect(); clearInterval(seqMT) } }
    }

    // ---- flap (stats numbers) ----
    let flapT = []
    function initFlap() {
      const sec = document.getElementById('stats')
      const els = sec ? $$('[data-flap]', sec) : []
      if (!els.length || els.some(e => !e.textContent.trim())) return retry(initFlap)
      const run = () => {
        els.forEach((el, k) => {
          const final = el.textContent
          const m = final.match(/^(\D*)([\d.]+)(.*)$/); if (!m) return
          const [, pre, num, post] = m
          const star = (s) => s.replace('★', '<span style="color:#D4FF00;-webkit-text-stroke:1.5px #0D0D0D">★</span>')
          const target = parseFloat(num), dec = (num.split('.')[1] || '').length
          el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = 'opacity .5s ease, transform .6s cubic-bezier(.2,.8,.2,1)'
          el.innerHTML = pre + (0).toFixed(dec) + star(post)
          flapT.push(setTimeout(() => {
            el.style.opacity = '1'; el.style.transform = 'none'
            const t0 = performance.now(), DUR = 1100
            const tick = now => { const p = Math.min(1, (now - t0) / DUR), v = target * (1 - Math.pow(1 - p, 3)); el.innerHTML = pre + (p < 1 ? v.toFixed(dec) : num) + star(post); if (p < 1) requestAnimationFrame(tick) }
            requestAnimationFrame(tick)
          }, k * 350))
        })
      }
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); run() } }, { threshold: 0.35 })
      io.observe(sec); D.push(() => io.disconnect())
    }

    // ---- servicios ----
    function initSvc() {
      const cards = $$('[data-svc-card]')
      if (cards.length < 4) return retry(initSvc)
      const E = 'cubic-bezier(.2,.8,.2,1)'
      let touch = false
      cards.forEach(c => {
        const img = $('image-slot', c)
        c.style.opacity = '0'; c.style.transform = 'translateY(56px) scale(.97)'; c.style.transition = 'opacity .8s ease, transform 1s ' + E + ', box-shadow .5s ease'
        if (img) { img.style.display = 'block'; img.style.transform = 'scale(1.14)'; img.style.transition = 'transform 1.4s ' + E }
        const ov = $('[data-svc-ov]', c), txt = $('[data-svc-txt]', c)
        const ovSib = ov ? [...c.children].filter(x => x !== ov && x.compareDocumentPosition(ov) & Node.DOCUMENT_POSITION_PRECEDING) : []
        const head = ovSib[0], pills = ovSib[1] ? [...ovSib[1].querySelectorAll('span')].filter(s => s.style.borderRadius === '999px') : []
        ;[head, ...pills].forEach(el => { if (el) el.style.transition = 'color .4s ease, background .4s ease, border-color .4s ease' })
        const set = en => {
          if (ov) ov.style.opacity = en ? '1' : '0'
          if (txt) txt.style.transform = en ? 'none' : 'translateY(12px)'
          if (head) head.style.color = en ? '#0D0D0D' : '#FFFFFF'
          pills.forEach(p => { p.style.color = en ? '#0D0D0D' : '#FFFFFF'; p.style.borderColor = en ? 'rgba(13,13,13,.3)' : 'rgba(255,255,255,.35)'; p.style.background = en ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.14)' })
        }
        c.style.webkitTouchCallout = 'none'; c.style.userSelect = 'none'
        on(c, 'mouseenter', () => { if (touch) return; set(true); if (!c._in) return; c.style.transform = 'translateY(-8px)'; c.style.boxShadow = '0 28px 60px rgba(13,13,13,.22)'; if (img) { img.style.transition = 'transform .8s ' + E; img.style.transform = 'scale(1.06)' } })
        on(c, 'mouseleave', () => { if (touch) return; set(false); if (!c._in) return; c.style.transform = 'none'; c.style.boxShadow = 'none'; if (img) img.style.transform = 'scale(1)' })
      })
      const fitAR = () => { const m = window.innerWidth < 768; cards.forEach(c => { if (!c._ar) c._ar = c.style.aspectRatio; c.style.aspectRatio = m ? '3 / 4' : c._ar }) }
      on(window, 'touchstart', () => { touch = true }, { once: true, passive: true })
      on(window, 'resize', fitAR); fitAR()
      let q = 0, qt = 0
      const io = new IntersectionObserver(es => {
        const now = performance.now(); if (now - qt > 400) q = 0
        es.filter(x => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left).forEach(x => {
          const c = x.target, img = $('image-slot', c), d = q++ * 160; qt = now; io.unobserve(c)
          flapT.push(setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'none'; if (img) img.style.transform = 'scale(1)'; setTimeout(() => { c._in = true }, 1000) }, d))
        })
      }, { threshold: 0.18 })
      cards.forEach(c => io.observe(c)); D.push(() => io.disconnect())
    }

    // ---- lemon loop (impacto) ----
    function initLemon() {
      const v = $('video[data-lemon]'); if (!v) return retry(initLemon)
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '')
      const go = () => v.play().catch(() => {})
      if (v.readyState >= 2) go(); else on(v, 'canplay', go, { once: true })
      v.load()
      const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? go() : v.pause()), { threshold: 0.1 })
      io.observe(v); D.push(() => io.disconnect())
    }

    // ---- testimonios marquee ----
    let tstRaf
    function initTst() {
      const wrap = document.getElementById('gpTst'), tr = wrap && $('[data-tst-track]', wrap)
      if (!tr || tr.children.length < 3) return retry(initTst)
      let x = 0, last = performance.now(), speed = 40, target = 40
      on(wrap, 'mouseenter', () => { target = 0 }); on(wrap, 'mouseleave', () => { target = 40 })
      const step = now => {
        const dt = Math.min(64, now - last) / 1000; last = now
        speed += (target - speed) * Math.min(1, dt * 4)
        const third = tr.scrollWidth / 3
        x -= speed * dt; if (third && -x >= third) x += third
        tr.style.transform = 'translate3d(' + x + 'px,0,0)'
        tstRaf = requestAnimationFrame(step)
      }
      tstRaf = requestAnimationFrame(step)
    }

    // ---- portafolio pinned ----
    let pfRaf, onPf
    function initPf() {
      const sec = document.getElementById('gpPf')
      const list = sec && $('[data-pf-list]', sec), track = sec && $('[data-pf-track]', sec)
      if (!list || !track || track.children.length < 2) return retry(initPf)
      const names = [...list.children], titles = names.map(n => $('[data-pf-title]', n)), imgs = [...track.children]
      const N = imgs.length
      const upd = () => {
        const rc = sec.getBoundingClientRect(), vh = window.innerHeight
        const p = Math.min(1, Math.max(0, -rc.top / Math.max(1, rc.height - vh)))
        const view = track.parentElement.clientHeight, ih = imgs[0].offsetHeight, gap = 32
        const first = (view - ih) / 2, f = p * (N - 1)
        track.style.transform = 'translate3d(0,' + (first - f * (ih + gap)) + 'px,0)'
        const a = Math.round(f)
        const box = list.parentElement.clientHeight, an = names[a]
        const y = box / 2 - (names[0].offsetTop + 0) - (an.offsetTop - names[0].offsetTop) - an.offsetHeight / 2
        list.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; list.style.transform = 'translate3d(0,' + y + 'px,0)'
        titles.forEach((t, i) => { if (t) t.style.color = i === a ? '#F3F2F2' : 'rgba(243,242,242,.28)' })
      }
      onPf = () => { cancelAnimationFrame(pfRaf); pfRaf = requestAnimationFrame(upd) }
      on(window, 'scroll', onPf, { passive: true }); on(window, 'resize', onPf); upd()
    }
    function initPfHover() {
      const sec = document.getElementById('gpPf'), cur = sec && $('[data-pf-cur]', sec)
      if (!cur || $$('[data-pf-ov]', sec).length < 2) return retry(initPfHover)
      if (!matchMedia('(hover:hover)').matches) return
      const col = cur.parentElement, R = (el) => { const r = el.getBoundingClientRect(); return Math.hypot(r.width, r.height) + 40 }
      let tx = 0, ty = 0, cx = 0, cy = 0, active = null, raf
      const loop = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; raf = requestAnimationFrame(loop) }
      const pos = (e, el) => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
      const open = (card, e) => { const ov = $('[data-pf-ov]', card); const [x, y] = pos(e, card); ov.style.transition = 'none'; ov.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)'; ov.offsetWidth; ov.style.transition = 'clip-path .7s cubic-bezier(.65,0,.25,1)'; ov.style.clipPath = 'circle(' + R(card) + 'px at ' + x + 'px ' + y + 'px)' }
      const close = (card, e) => { const ov = $('[data-pf-ov]', card); const [x, y] = pos(e, card); ov.style.transition = 'none'; ov.style.clipPath = 'circle(' + R(card) + 'px at ' + x + 'px ' + y + 'px)'; ov.offsetWidth; ov.style.transition = 'clip-path .6s cubic-bezier(.65,0,.25,1)'; ov.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)' }
      on(col, 'mousemove', (e) => {
        const [x, y] = pos(e, col); tx = x; ty = y
        const card = e.target.closest && e.target.closest('[data-pf-img]')
        if (card !== active) { if (active) close(active, e); if (card) open(card, e); active = card }
        cur.style.transform = card ? 'scale(1)' : 'scale(0)'
      })
      on(col, 'mouseenter', (e) => { const [x, y] = pos(e, col); cx = tx = x; cy = ty = y; if (!raf) loop() })
      on(col, 'mouseleave', (e) => { if (active) close(active, e); active = null; cur.style.transform = 'scale(0)'; cancelAnimationFrame(raf); raf = null })
      col.style.cursor = 'none'
      D.push(() => cancelAnimationFrame(raf))
    }

    // ---- problema scroll cards ----
    let onProbScroll
    function initProb() {
      const finals = [{ x: -1, y: 10, r: -6 }, { x: 0, y: -4, r: -2 }, { x: 1, y: 6, r: 4 }]
      const ease = (t) => 1 - Math.pow(1 - t, 3)
      onProbScroll = () => {
        const s = document.getElementById('gpProb'); if (!s) return
        const cardRefs = $$('.gpProbCard'); if (cardRefs.length < 3) return
        const r = s.getBoundingClientRect()
        const span = r.height - window.innerHeight
        const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
        const spread = Math.min(300, window.innerWidth * 0.6) * 0.82
        const mob = window.innerWidth < 768
        const mw = Math.min(520, window.innerWidth - 40), mh = Math.min(184, window.innerHeight * 0.23)
        const finalsM = [{ y: -1, r: -2 }, { y: 0, r: 1.5 }, { y: 1, r: -1.5 }]
        cardRefs.forEach((el, i) => {
          if (!el) return
          const mode = mob ? 'm' : 'd'
          if (el._mode !== mode || (mob && el.style.flexDirection !== 'row')) {
            el._mode = mode
            const st = el.style, kids = el.children
            const K = ['width', 'height', 'left', 'top', 'flexDirection', 'alignItems', 'justifyContent', 'gap', 'padding']
            if (!el._orig) { el._orig = {}; K.forEach(k => el._orig[k] = st[k]); el._origK = [kids[0].style.fontSize, kids[0].style.flex, kids[1].style.justifyContent, kids[1].style.gap, kids[1].style.minWidth, kids[1].children[0].style.fontSize, kids[1].children[1].style.fontSize] }
            if (mob) { st.width = mw + 'px'; st.height = mh + 'px'; st.left = (-mw / 2) + 'px'; st.top = (-mh / 2) + 'px'; st.flexDirection = 'row'; st.alignItems = 'center'; st.justifyContent = 'flex-start'; st.gap = '20px'; st.padding = '22px'; kids[0].style.fontSize = '56px'; kids[0].style.flex = 'none'; kids[1].style.justifyContent = 'center'; kids[1].style.gap = '10px'; kids[1].style.minWidth = '0'; kids[1].children[0].style.fontSize = '22px'; kids[1].children[1].style.fontSize = '15px' }
            else { K.forEach(k => st[k] = el._orig[k]); const o = el._origK; kids[0].style.fontSize = o[0]; kids[0].style.flex = o[1]; kids[1].style.justifyContent = o[2]; kids[1].style.gap = o[3]; kids[1].style.minWidth = o[4]; kids[1].children[0].style.fontSize = o[5]; kids[1].children[1].style.fontSize = o[6] }
          }
          if (mob) {
            const tm = ease(Math.min(1, Math.max(0, (p - 0.05 - i * 0.27) / 0.3)))
            const fm = finalsM[i]
            const ym = (1 - tm) * window.innerHeight * 1.1 + fm.y * (mh + 16) * tm
            const rm = (1 - tm) * (i % 2 ? -10 : 10) + fm.r * tm
            el.style.transform = 'translate3d(0,' + ym + 'px,0) rotate(' + rm + 'deg)'; return
          }
          const t = ease(Math.min(1, Math.max(0, (p - 0.05 - i * 0.27) / 0.3)))
          const f = finals[i]
          const x = f.x * spread * t
          const y = (1 - t) * window.innerHeight * 1.1 + f.y * t
          const rot = (1 - t) * (i % 2 ? -14 : 14) + f.r * t
          el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + rot + 'deg)'
        })
      }
      on(window, 'scroll', onProbScroll, { passive: true }); on(window, 'resize', onProbScroll); onProbScroll()
    }

    // ---- clock ----
    function initClock() {
      const tick = () => {
        const c = document.getElementById('gpClock'), l = document.getElementById('gpClockLabel'); if (!c) return
        const now = new Date()
        c.textContent = now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })
        if (l) l.textContent = { manana: 'Mañana', mediodia: 'Mediodía', atardecer: 'Atardecer', noche: 'Noche' }[heroKey()]
      }
      const id = setInterval(tick, 15000); D.push(() => clearInterval(id)); tick()
    }

    // ---- menu ----
    function initMenu() {
      const menu = document.getElementById('gpMenu'); if (!menu) return
      const setMenu = v => { menu.style.opacity = v ? '1' : '0'; menu.style.transform = 'scale(' + (v ? 1 : .96) + ')'; menu.style.pointerEvents = v ? 'auto' : 'none'; document.documentElement.style.overflow = v ? 'hidden' : '' }
      $$('[data-gp="menuOpen"]').forEach(b => on(b, 'click', () => setMenu(true)))
      $$('[data-gp="menuClose"]').forEach(b => on(b, 'click', () => setMenu(false)))
    }

    // ---- faq hover + mobile ----
    function initFaq() {
      const rows = $$('.gpFaqRow'); if (!rows.length) return
      rows.forEach(row => {
        const line = row.children[0], img = row.children[1], qd = row.children[2], ansWrap = row.children[3]
        const ans = ansWrap && ansWrap.children[0]; if (!ans) return
        const isMob = () => window.innerWidth < 768
        const setHover = en => { if (isMob()) return; img.style.opacity = en ? '1' : '0'; img.style.transform = en ? 'scale(1)' : 'scale(.97)'; qd.style.fontWeight = en ? '600' : '400'; qd.style.color = en ? '#FFFFFF' : '#0D0D0D'; ans.style.opacity = en ? '1' : '0'; ans.style.transform = en ? 'translateX(0px)' : 'translateX(-16px)' }
        on(row, 'mouseenter', () => setHover(true)); on(row, 'mouseleave', () => setHover(false))
        const sync = () => {
          if (isMob()) { row.style.minHeight = '0px'; line.style.background = '#D4FF00'; qd.style.color = '#0D0D0D'; qd.style.fontWeight = '400'; ansWrap.style.justifyContent = 'flex-start'; ansWrap.style.textAlign = 'left'; ans.style.color = '#3A3836'; ans.style.webkitLineClamp = 'unset'; ans.style.opacity = '1'; ans.style.transform = 'translateX(0px)'; img.style.opacity = '0' }
          else { row.style.minHeight = 'clamp(104px,8vw,124px)'; line.style.background = 'rgba(13,13,13,.18)'; qd.style.color = '#0D0D0D'; qd.style.fontWeight = '400'; ansWrap.style.justifyContent = 'flex-end'; ansWrap.style.textAlign = 'right'; ans.style.color = '#F3F2F2'; ans.style.webkitLineClamp = '2'; ans.style.opacity = '0'; ans.style.transform = 'translateX(-16px)'; img.style.opacity = '0'; img.style.transform = 'scale(.97)' }
        }
        on(window, 'resize', sync); sync()
      })
    }

    // ---- blog hover ----
    function initBlog() {
      $$('.gpBlogCard').forEach(a => {
        const card = a.children[0]; if (!card) return
        const bg = card.children[0], grad = card.children[3], txt = card.children[4], title = a.children[2]
        const set = en => {
          if (bg) bg.style.transform = en ? 'scale(1.05)' : 'scale(1)'
          if (grad) grad.style.opacity = en ? '1' : '0'
          if (txt) { txt.style.opacity = en ? '1' : '0'; txt.style.filter = en ? 'blur(0px)' : 'blur(10px)'; txt.style.transform = en ? 'translateY(0px)' : 'translateY(14px)' }
          if (title) title.style.fontWeight = en ? '600' : '400'
        }
        on(a, 'mouseenter', () => set(true)); on(a, 'mouseleave', () => set(false))
      })
    }

    // ---- portafolio móvil hover ----
    function initPfm() {
      $$('.gpPfmCard').forEach(a => {
        const card = a.children[0]; if (!card) return
        const scaleWrap = card.children[0], overlay = card.children[4]
        const rc0 = overlay && overlay.children[0], rc1 = overlay && overlay.children[1]
        const set = en => {
          if (scaleWrap) scaleWrap.style.transform = en ? 'scale(1.05)' : 'scale(1)'
          if (overlay) overlay.style.clipPath = en ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)'
          if (rc0) { rc0.style.opacity = en ? '1' : '0'; rc0.style.filter = en ? 'blur(0px)' : 'blur(10px)'; rc0.style.transform = en ? 'translateY(0px)' : 'translateY(14px)' }
          if (rc1) rc1.style.opacity = en ? '1' : '0'
        }
        on(a, 'mouseenter', () => set(true)); on(a, 'mouseleave', () => set(false))
      })
    }

    // ---- form ----
    function initForm() {
      const idle = $('[data-gp-form="idle"]'), done = $('[data-gp-form="done"]')
      if (!idle) return
      on(idle, 'submit', e => { e.preventDefault(); idle.style.display = 'none'; if (done) done.style.display = 'flex' })
    }

    // arrancar todo
    initReveal(); initStatHover(); initLemonTitle(); initNav(); initClock(); loadVideo(); initSeq(); initFlap(); initSvc(); initLemon(); initTst(); initPf(); initPfHover(); initProb(); initMenu(); initFaq(); initBlog(); initPfm(); initForm()

    return () => {
      D.forEach(fn => { try { fn() } catch (e) {} })
      rafs.forEach(id => cancelAnimationFrame(id))
      cancelAnimationFrame(seqRaf); cancelAnimationFrame(tstRaf); cancelAnimationFrame(pfRaf)
      if (seqIO) seqIO.disconnect()
      if (seqVs) seqVs.forEach(v => { v.onended = null })
      flapT.forEach(clearTimeout)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
