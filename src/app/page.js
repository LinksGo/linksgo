import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, BarChart3, Palette, Smartphone, Code2, Braces, Database, Blocks, Cpu } from 'lucide-react';
import { FaGithub, FaGitlab, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { InstallPWA } from '@/components/install-pwa';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-screen bg-gradient-to-b from-purple-900/50 via-purple-800/30 to-transparent">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-purple-500/20 rounded-full filter blur-[128px] animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] -bottom-48 -right-48 bg-pink-500/20 rounded-full filter blur-[128px] animate-pulse delay-1000"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">LinksGo</span>
            </div>
            <div className="flex items-center space-x-4">
              <InstallPWA />
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-lg bg-purple-900/50 text-white hover:bg-purple-900/70 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                LinksGo
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Share your links with style. Create beautiful, customizable link pages in minutes.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/dashboard" 
                className="px-8 py-3 text-lg font-medium rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-3 text-lg font-medium rounded-xl border border-purple-500/50 text-white hover:bg-purple-500/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Feature Cards */}
            <div className="p-6 rounded-2xl bg-purple-900/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Experience blazing-fast performance with our optimized platform.</p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-900/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Customizable</h3>
              <p className="text-gray-300">
                Make your link page truly yours with our powerful customization tools.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-900/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
              <p className="text-gray-300">Your data is protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="relative bg-gradient-to-b from-transparent via-purple-900/10 to-black pt-32 pb-24">
        {/* Features Section */}
        <section className="bg-black text-white py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Power-Packed Features</h2>
              <p className="text-gray-400 text-lg">Everything you need to create and manage your perfect link hub</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">Custom Themes</h4>
                <p className="text-gray-300">
                  Create stunning pages with our theme engine. Support for custom CSS and animations.
                </p>
              </div>
              
              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">Advanced Analytics</h4>
                <p className="text-gray-300">
                  Real-time insights with detailed metrics, visitor tracking, and conversion analysis.
                </p>
              </div>
              
              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Braces className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">API Access</h4>
                <p className="text-gray-300">
                  Full REST API support with detailed documentation for seamless integration.
                </p>
              </div>

              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">URL Shortener</h4>
                <p className="text-gray-300">
                  Create concise, memorable short links instantly. Perfect for social media sharing and marketing campaigns.
                </p>
              </div>

              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 6v4m2-4h-2m-4 4h.01M17 21h-2a2 2 0 01-2-2v-2H9v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2h2v-2H3v-2h2v-2H3V9h2V7a2 2 0 012-2h2a2 2 0 012 2v2h2V7a2 2 0 012-2h2a2 2 0 012 2v2h2v2h-2v2h2v2h-2v2h2v2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">QR Code Generator</h4>
                <p className="text-gray-300">
                  Generate custom QR codes for your links instantly. Perfect for print materials and contactless sharing.
                </p>
              </div>

              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">Secure by Default</h4>
                <p className="text-gray-300">
                  Enterprise-grade security with SSL encryption, rate limiting, and advanced authentication options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-black text-white py-16 md:py-24 relative mt-8 md:mt-0">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Powered by Modern Tech Stack
            </h3>
            <p className="text-gray-300 mt-2">Built with the latest and most reliable technologies</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
            
            {/* Single Row - Moving Left */}
            <div className="flex animate-marquee">
              <div className="flex space-x-32 py-12 items-center">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                  alt="JavaScript"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                  alt="Next.js"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all dark:invert"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  alt="React"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
                  alt="Tailwind CSS"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                  alt="PostgreSQL"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                  alt="TypeScript"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                  alt="Node.js"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                  alt="Docker"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                  alt="Redis"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg"
                  alt="AWS"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all dark:invert"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
                  alt="Jest"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                  alt="NGINX"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png"
                  alt="Supabase"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                  alt="ChatGPT"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
              {/* Duplicate for seamless scrolling */}
              <div className="flex space-x-32 py-12 items-center">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                  alt="JavaScript"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                  alt="Next.js"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all dark:invert"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  alt="React"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
                  alt="Tailwind CSS"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                  alt="PostgreSQL"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                  alt="TypeScript"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                  alt="Node.js"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                  alt="Docker"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                  alt="Redis"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg"
                  alt="AWS"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all dark:invert"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
                  alt="Jest"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                  alt="NGINX"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png"
                  alt="Supabase"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                  alt="ChatGPT"
                  width={64}
                  height={64}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <div className="relative z-10 mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              API Documentation
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              Integrate LinksGo into your applications with our simple API
            </p>
          </div>

          <div className="bg-purple-900/20 rounded-2xl border border-purple-500/20 p-8 backdrop-blur-xl">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`// Create a new link
const response = await fetch('https://api.linksgo.app/v1/links', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Website',
    url: 'https://example.com',
    theme: 'neon'
  })
});

Note: This API is not released yet.
`}</code>
            </pre>
          </div>
        </div>

        {/* Status Section */}
        <div className="relative z-10 mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              System Status
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              Real-time status of our services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl border border-purple-700/50 bg-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
                  </svg>
                  <span className="font-semibold text-white">AWS Amplify</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-500 text-sm">Operational</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-700/50 bg-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 7h-7.02l2.76-3.77a1 1 0 011-1.16L10 7h-2L4.89 2.07a1 1 0 00-1.63 1.16L6.02 7H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  </svg>
                  <span className="font-semibold text-white">S3 Bucket</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-500 text-sm">Operational</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-700/50 bg-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
                  </svg>
                  <span className="font-semibold text-white">Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-500 text-sm">Operational</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-700/50 bg-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.997 19.432l1.954-7.545L4 8.118l12.004-.872L17.958 0l-1.954 7.545L24 11.314l-12.004.872L9.997 19.432z"/>
                  </svg>
                  <span className="font-semibold text-white">Railway</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-500 text-sm">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Section */}
        <div className="relative z-10 mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-900/20 rounded-2xl border border-purple-500/20 p-8 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-300">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-purple-400" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Support Open Source</h3>
              <p className="text-gray-300">
                If you love LinksGo, consider starring our GitHub repository. It helps us grow and improve the platform!
              </p>
              <div className="pt-2">
                <Link 
                  href="https://github.com/LinksGo/linksgo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-purple-700/50 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white transition-all duration-300 font-medium"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 mt-32 pt-12 border-t border-purple-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">LinksGo</span>
              </div>

              <div className="flex space-x-4">
                <Link
                  href="https://github.com/Retr0-XD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FaGithub className="h-6 w-6" />
                </Link>
                <Link
                  href="https://gitlab.com/Retr0-XD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FaGitlab className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.instagram.com/rea1_slim_shady_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FaInstagram className="h-6 w-6" />
                </Link>
                <Link
                  href="mailto:retr0secanddev@gmail.com"
                  className="text-gray-400 hover:text-white"
                >
                  <FaEnvelope className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-400 text-sm pb-8">
              &copy; {new Date().getFullYear()} LinksGo. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
