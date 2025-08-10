import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Underserved Sports',
    template: '%s • Underserved Sports',
  },
  description: 'News and insights on underserved leagues.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Underserved Sports',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Underserved Sports',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
  }
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'Underserved Sports',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={query}`,
      'query-input': 'required name=query',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-wide">
              Underserved Sports
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/">Home</Link>
              <Link href="/leagues">Leagues</Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl mx-auto w-full">{children}</main>

        <footer className="border-t mt-10">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Underserved Sports
          </div>
        </footer>

        <JsonLd data={org} />
        <JsonLd data={webSite} />
      </body>
    </html>
  )
}
