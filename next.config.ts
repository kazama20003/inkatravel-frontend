/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Spanish routes (default)
      {
        source: '/es',
        destination: '/',
      },
      {
        source: '/es/:path*',
        destination: '/:path*',
      },
      // English routes
      {
        source: '/en',
        destination: '/',
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
      },
      // French routes
      {
        source: '/fr',
        destination: '/',
      },
      {
        source: '/fr/:path*',
        destination: '/:path*',
      },
      // German routes
      {
        source: '/de',
        destination: '/',
      },
      {
        source: '/de/:path*',
        destination: '/:path*',
      },
      // Italian routes
      {
        source: '/it',
        destination: '/',
      },
      {
        source: '/it/:path*',
        destination: '/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
}

export default nextConfig
