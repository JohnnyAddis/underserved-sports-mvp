import Link from 'next/link'
import { sanity } from '@/lib/sanity'

type LeagueRow = {
  name: string
  slug: string
  featuredRank?: number | null
  count: number
}

type LeagueLink = { name: string; slug: string }

const NAV_ITEM =
  'rounded px-2 py-1 text-sm font-medium text-slate-800 hover:text-indigo-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

async function fetchLeagues(): Promise<LeagueRow[]> {
  return sanity.fetch<LeagueRow[]>(`
    *[_type=="league"]{
      name,
      "slug": slug.current,
      featuredRank,
      "count": count(*[_type=="article" && references(^._id)])
    }
  `)
}

function pickTopByFeaturedOrCount(rows: LeagueRow[], n: number): LeagueLink[] {
  const ranked = rows
    .filter(r => typeof r.featuredRank === 'number')
    .sort((a, b) => (a.featuredRank! - b.featuredRank!))
  if (ranked.length > 0) {
    // use featured first
    const take = ranked.slice(0, n).map(r => ({ name: r.name, slug: r.slug }))
    if (take.length < n) {
      const chosen = new Set(take.map(t => t.slug))
      const byCount = rows
        .filter(r => !chosen.has(r.slug))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, n - take.length)
        .map(r => ({ name: r.name, slug: r.slug }))
      return [...take, ...byCount]
    }
    return take
  }
  // no featured → by count
  return rows
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, n)
    .map(r => ({ name: r.name, slug: r.slug }))
}

export default async function NavBar() {
  const rows = await fetchLeagues()

  // Desktop: top 3
  const top3Desktop = pickTopByFeaturedOrCount(rows, 3)

  // Mobile: top 5
  const top5Mobile = pickTopByFeaturedOrCount(rows, 5)

  const top3Slugs = new Set(top3Desktop.map(l => l.slug))
  const top5Slugs = new Set(top5Mobile.map(l => l.slug))

  const othersDesktop: LeagueLink[] = rows
    .filter(r => !top3Slugs.has(r.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(r => ({ name: r.name, slug: r.slug }))

  const othersMobile: LeagueLink[] = rows
    .filter(r => !top5Slugs.has(r.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(r => ({ name: r.name, slug: r.slug }))

  return (
    <header className="border-b bg-white">
      {/* Top bar */}
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + desktop links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="Underserved Sports home"
            className="flex items-center rounded px-2 py-1 text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
          >
            Underserved Sports
          </Link>

          {/* Desktop primary nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className={NAV_ITEM}>
              Home
            </Link>

            {top3Desktop.map((l) => (
              <Link key={l.slug} href={`/leagues/${l.slug}`} className={NAV_ITEM}>
                {l.name}
              </Link>
            ))}

            {/* More Leagues (desktop): only leagues NOT in top3 */}
            <details className="relative">
              <summary
                className={`${NAV_ITEM} list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden`}
              >
                More Leagues
              </summary>
              <ul
                className="absolute left-0 z-50 mt-2 max-h-72 w-56 overflow-auto rounded-lg border bg-white p-2 shadow-lg"
                role="menu"
                aria-label="More leagues"
              >
                {othersDesktop.length ? (
                  othersDesktop.map((l) => (
                    <li key={l.slug} role="none">
                      <Link
                        role="menuitem"
                        href={`/leagues/${l.slug}`}
                        className="block rounded px-2 py-1 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-2 py-1 text-sm text-slate-500">No other leagues yet</li>
                )}
                <li className="mt-2 border-t pt-2" role="none">
                  <Link
                    role="menuitem"
                    href="/leagues"
                    className="block rounded px-2 py-1 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    All Leagues
                  </Link>
                </li>
              </ul>
            </details>
          </div>
        </div>

        {/* Right: Mobile hamburger */}
        <details className="md:hidden relative">
          <summary
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-slate-800">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>

          {/* Mobile panel: only leagues NOT in top5 to avoid duplicates */}
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="p-2">
              <Link href="/" className="block rounded px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                Home
              </Link>

              <div className="my-2 border-t" />

              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                More Leagues
              </div>
              {othersMobile.length ? (
                <ul className="max-h-64 overflow-auto">
                  {othersMobile.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/leagues/${l.slug}`}
                        className="block rounded px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500">No other leagues yet</div>
              )}

              <div className="mt-2">
                <Link
                  href="/leagues"
                  className="block rounded px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  All Leagues
                </Link>
              </div>
            </div>
          </div>
        </details>
      </nav>

      {/* Mobile-only horizontal league rail (top 5) */}
      {top5Mobile.length > 0 && (
        <div className="md:hidden border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {top5Mobile.map((l) => (
                <Link
                  key={l.slug}
                  href={`/leagues/${l.slug}`}
                  className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-800 hover:border-indigo-300 hover:bg-slate-50"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
