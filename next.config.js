/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true
  },
  output: 'standalone',
  swcMinify: true,
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig
