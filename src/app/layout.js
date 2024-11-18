import { Providers } from './providers'
import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'LinksGo - Your Ultimate Link Management Platform',
  description: 'Create, manage, and track your links with LinksGo. Generate QR codes, create beautiful link pages, and more.',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="LinksGo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LinksGo" />
        {viewport.themeColor.map((themeColor, index) => (
          <meta key={index} name="theme-color" content={themeColor.color} media={themeColor.media} />
        ))}
        <meta name="viewport" content={viewport.viewport} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Script
          id="register-sw"
          strategy="lazyOnload"
        >
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful');
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
