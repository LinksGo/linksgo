'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  FaLink, 
  FaLightbulb, 
  FaHourglassHalf, 
  FaQrcode, 
  FaChartLine, 
  FaMusic, 
  FaCompressArrowsAlt, 
  FaShieldAlt, 
  FaRocket, 
  FaBook,
  FaMobile,
  FaWifi,
  FaBolt,
  FaMagic,
  FaDownload,
  FaHeart
} from 'react-icons/fa'
import ThemeLogo from '@/components/ThemeLogo'
import { Button } from '@nextui-org/react'

export default function Home() {
  const { data: session } = useSession()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  const handleDonateClick = () => {
    const emailSubject = encodeURIComponent('LinksGo Donation Inquiry');
    const emailBody = encodeURIComponent(
      'Hi there,\n\nI\'m interested in making a donation to support LinksGo. Please provide more information about how I can contribute.\n\nThank you!'
    );
    window.location.href = `mailto:contact@codewithrodi.com?subject=${emailSubject}&body=${emailBody}`;
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    })

    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="page-container">
        {/* Hero Section */}
        <header className="text-center py-16 sm:py-20">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <ThemeLogo width={96} height={96} className="drop-shadow-lg" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
                LinksGo
              </span>
            </div>
            <span className="text-foreground">
              Your Ultimate Link Management Platform
            </span>
          </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto">
            The ultimate platform for managing and sharing your digital presence.
            Create beautiful link pages, generate QR codes, and track your success.
          </p>
          
          <div className="mt-8 space-x-4">
            {!session ? (
              <>
                <Link 
                  href="/auth/signin"
                  className="btn-primary inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-600 transition-all"
                >
                  Get Started
                  <FaRocket className="ml-2" />
                </Link>
                <Link
                  href="#features"
                  className="btn-secondary inline-flex items-center px-6 py-3 rounded-lg bg-default-100 text-foreground hover:bg-default-200 transition-all"
                >
                  Explore Features
                </Link>
                <Link
                  href="/docs"
                  className="btn-secondary inline-flex items-center px-6 py-3 rounded-lg bg-default-100 text-foreground hover:bg-default-200 transition-all"
                >
                  Documentation
                  <FaBook className="ml-2" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="btn-primary inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-600 transition-all"
                >
                  Go to Dashboard
                  <FaRocket className="ml-2" />
                </Link>
                <Link
                  href="/docs"
                  className="btn-secondary inline-flex items-center px-6 py-3 rounded-lg bg-default-100 text-foreground hover:bg-default-200 transition-all"
                >
                  Documentation
                  <FaBook className="ml-2" />
                </Link>
              </>
            )}
          </div>
          
          {/* PWA Install Button */}
          {showInstallButton && (
            <div className="mt-6">
              <Button
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold"
                onClick={handleInstallClick}
                startContent={<FaDownload />}
              >
                Install LinksGo App
              </Button>
            </div>
          )}
        </header>

        {/* PWA Features Section */}
        <section className="py-12 bg-default-50 dark:bg-black rounded-xl mb-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Install LinksGo on Your Device
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="feature-card">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 w-10 h-10 flex items-center justify-center mb-4">
                  <FaMobile className="text-lg text-primary dark:text-primary-500" />
                </div>
                <h3 className="feature-title">Mobile-First</h3>
                <p className="feature-description">
                  Optimized for all devices with a responsive design
                </p>
              </div>
              <div className="feature-card">
                <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/30 dark:from-success/30 dark:to-success/40 w-10 h-10 flex items-center justify-center mb-4">
                  <FaWifi className="text-lg text-success dark:text-success-500" />
                </div>
                <h3 className="feature-title">Works Offline</h3>
                <p className="feature-description">
                  Access your links even without internet
                </p>
              </div>
              <div className="feature-card">
                <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-warning/30 dark:from-warning/30 dark:to-warning/40 w-10 h-10 flex items-center justify-center mb-4">
                  <FaBolt className="text-lg text-warning dark:text-warning-500" />
                </div>
                <h3 className="feature-title">Fast & Reliable</h3>
                <p className="feature-description">
                  Lightning-fast performance like a native app
                </p>
              </div>
              <div className="feature-card">
                <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/30 dark:from-secondary/30 dark:to-secondary/40 w-10 h-10 flex items-center justify-center mb-4">
                  <FaMagic className="text-lg text-secondary dark:text-secondary-500" />
                </div>
                <h3 className="feature-title">Auto Updates</h3>
                <p className="feature-description">
                  Always get the latest features automatically
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="icon-wrapper">
                <FaLink className="feature-icon" />
              </div>
              <h3 className="feature-title">Link Management</h3>
              <p className="feature-description">
                Create and manage all your important links in one place. Organize them with custom titles and descriptions.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaCompressArrowsAlt className="feature-icon" />
              </div>
              <h3 className="feature-title">Link Shortening</h3>
              <p className="feature-description">
                Transform long URLs into short, memorable links. Perfect for social media sharing.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaQrcode className="feature-icon" />
              </div>
              <h3 className="feature-title">QR Code Generation</h3>
              <p className="feature-description">
                Generate QR codes for your links instantly. Great for print materials and offline promotion.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaChartLine className="feature-icon" />
              </div>
              <h3 className="feature-title">Analytics</h3>
              <p className="feature-description">
                Track link performance with detailed analytics. Monitor clicks, traffic sources, and user engagement.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaShieldAlt className="feature-icon" />
              </div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">
                Built with security in mind. Your data is protected and your links are always available.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaMusic className="feature-icon" />
              </div>
              <h3 className="feature-title">Music Profile</h3>
              <p className="feature-description">
                Coming Soon: Share your favorite music and playlists directly on your profile.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose LinksGo */}
        <section className="py-16 bg-default-50 dark:bg-gray-900 rounded-xl my-8">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose LinksGo?</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-success/20 rounded-lg">
                  <FaRocket className="text-xl text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Lightning Fast Setup</h3>
                  <p className="text-default-600">Get started in seconds. No technical knowledge required. Our intuitive interface makes link management a breeze.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <FaShieldAlt className="text-xl text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Enterprise-Grade Security</h3>
                  <p className="text-default-600">Your data is protected with industry-standard security measures. We prioritize the safety of your information.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <FaChartLine className="text-xl text-warning" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Detailed Analytics</h3>
                  <p className="text-default-600">Make data-driven decisions with our comprehensive analytics. Track performance and optimize your link strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Streamline Your Digital Presence?</h2>
          <p className="text-default-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust LinksGo to manage their online presence.
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signin"
              className="btn-primary inline-flex items-center px-8 py-4 rounded-lg bg-primary text-white hover:bg-primary-600 transition-all text-lg font-semibold"
            >
              Get Started for Free
              <FaRocket className="ml-2" />
            </Link>
            {showInstallButton && (
              <Button
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 text-lg"
                onClick={handleInstallClick}
                startContent={<FaDownload />}
              >
                Install App
              </Button>
            )}
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-12 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Support LinksGo</h2>
            <p className="text-default-600 mb-6">
              Help us keep LinksGo free and open source. Your support enables us to maintain and improve the platform for everyone.
            </p>
            <p className="text-default-600">
              Contact <span className="font-semibold text-primary">retr0</span> for donations and support inquiries.
            </p>
            <p className="text-small text-default-500 mt-4">
              Every contribution makes a difference, no matter how small.
            </p>
          </div>
        </section>

      </div>

      {/* Add styles */}
      <style jsx>{`
        .feature-card {
          @apply p-6 rounded-xl bg-background dark:bg-black/40 shadow-lg hover:shadow-xl transition-all;
        }
        .icon-wrapper {
          @apply p-3 rounded-lg bg-primary/20 w-12 h-12 flex items-center justify-center mb-4;
        }
        .feature-icon {
          @apply text-xl text-primary;
        }
        .feature-title {
          @apply text-xl font-semibold mb-3 text-foreground;
        }
        .feature-description {
          @apply text-default-600;
        }
      `}</style>
    </div>
  )
}
