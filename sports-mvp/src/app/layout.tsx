import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import NavLink from '@/components/NavLink'

export const metadata: Metadata = {
  title: { default: 'Underserved Sports', template: '%s | Underserved Sports' },
  description: 'Coverage of underserved sports and leagues.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
              <span className="text-indigo-700">Underserved</span> Sports
            </Link>
            <div className="flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/leagues">Leagues</NavLink>
            </div>
          </nav>
        </header>

        <main className="flex-1 container mx-auto px-6 py-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="container mx-auto px-6 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} Underserved Sports
          </div>
        </footer>
      </body>
    </html>
  )
}
