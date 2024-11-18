/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true, // Required for static image optimization in Amplify
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  generateEtags: true,
  // Amplify specific optimizations
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
}

module.exports = nextConfig
