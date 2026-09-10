# Greenpop Studio — Sitio web (Next.js)

Sitio de Greenpop Studio en **React / Next.js 15 (App Router)**: landing de captación de leads + política de privacidad + blog en Markdown. Mismo stack (React) que tu app React Native.

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # desarrollo -> http://localhost:3000
npm run build     # genera el sitio estático en /out (output: 'export')
```

`npm run build` produce una carpeta **`out/`** 100% estática, lista para subir a **Netlify, Vercel, Cloudflare Pages** o cualquier hosting.

## Estructura

```
app/
  layout.jsx              → nav + footer + WhatsApp + metadata/SEO
  page.jsx                → landing (todas las secciones)
  privacidad/page.jsx     → política de privacidad
  blog/page.jsx           → listado del blog
  blog/[slug]/page.jsx    → artículo (renderiza el Markdown)
  globals.css             → estilos y variables de marca (Greenpop Light)
components/               → Header, Footer, WhatsAppFab, ScrollReveal, ContactForm
lib/posts.js             → lee content/blog, ordena y convierte Markdown a HTML
content/blog/*.md        → los artículos del blog
public/fonts/            → Outfit (.woff2) · public/greenpop-lockup.png → logo
```

## ✍️ Publicar un artículo nuevo (sin base de datos)

Crea un `.md` en `content/blog/` (nombre sin tildes/ñ/espacios → será la URL) con este encabezado:

```markdown
---
title: "Tu título"
description: "Resumen para Google y la tarjeta del blog"
date: 2026-09-15
author: "José Mobresú"
tags: ["Diseño web", "Conversión"]
---

## Subtítulo

Tu contenido en Markdown…
```

Guarda y haz `npm run build` (o `git push` si tu hosting reconstruye solo). Listo — se ordena por fecha automáticamente.

## Pendientes antes de publicar (marcados en el código)
- Número real de **WhatsApp** en `components/WhatsAppFab.jsx` y `components/Footer.jsx`.
- Correo de contacto en `app/privacidad/page.jsx`.
- Conectar el **formulario** (`components/ContactForm.jsx`) a un servicio de envío (Formspree, endpoint propio, etc.).
- Reemplazar métricas/testimonios de ejemplo por datos reales.
