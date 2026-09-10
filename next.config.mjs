/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática: genera un sitio 100% estático (deploy en Netlify/Vercel/Cloudflare/cualquier hosting)
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true
}

export default nextConfig
