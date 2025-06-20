// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // ⬇️ Esto es lo clave
  experimental: {
    forceWebVitalsReporting: true,
  },
  output: 'standalone',
  trailingSlash: false,
}

export default nextConfig
