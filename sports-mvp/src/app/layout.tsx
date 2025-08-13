// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'

//Vercel Analytics + Speed Insights
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://underservedsports.com'),
  title: { 
    default: 'Underserved Sports - Global Sports Coverage', 
    template: '%s | Underserved Sports' 
  },
  description: 'Comprehensive news, scores, and analysis for underserved sports leagues worldwide. Bringing attention to international sports that deserve more coverage.',
  keywords: ['sports news', 'international sports', 'underserved leagues', 'global sports coverage', 'sports analysis'],
  authors: [{ name: 'Underserved Sports Team' }],
  creator: 'Underserved Sports',
  publisher: 'Underserved Sports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://underservedsports.com',
    siteName: 'Underserved Sports',
    title: 'Underserved Sports - Global Sports Coverage',
    description: 'Comprehensive news, scores, and analysis for underserved sports leagues worldwide.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@underservedsports', // Add your Twitter handle
    creator: '@underservedsports',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // yahoo: 'yahoo-verification-code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <NavBar />
        <main className="container mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Underserved Sports
        </footer>

        {/*  Metrics (safe on both dev & prod; Vercel picks them up automatically) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
