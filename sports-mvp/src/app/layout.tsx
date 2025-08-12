// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'

//Vercel Analytics + Speed Insights
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: { default: 'Underserved Sports', template: '%s | Underserved Sports' },
  description: 'News and coverage for underserved sports leagues around the world.',
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
