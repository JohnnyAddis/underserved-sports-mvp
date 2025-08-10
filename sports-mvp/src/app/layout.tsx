import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Underserved Sports',
  description: 'MVP sports news platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-14 flex items-center justify-between">
              <Link href="/" className="font-semibold">Underserved Sports</Link>
              <ul className="flex items-center gap-6 text-sm">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/leagues">Leagues</Link></li>
                <li><Link href="/news">News</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
          {children}
        </main>
        <footer className="border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Underserved Sports
        </footer>
      </body>
    </html>
  );
}