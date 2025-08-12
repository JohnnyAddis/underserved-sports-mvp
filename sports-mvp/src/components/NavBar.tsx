// src/components/NavBar.tsx
import Link from 'next/link'
import { sanity } from '@/lib/sanity'

type LeagueNavItem = { name: string; slug: string }

const NAV_ITEM =
  'rounded px-2 py-1 text-sm font-medium text-slate-800 hover:text-indigo-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

export default async function NavBar() {
  // Fetch leagues (alphabetical for now; we can switch to popularity/featured later)
  const leagues = await sanity.fetch<LeagueNavItem[]>(
    `*[_type=="league"]|order(name asc){
      "name": name,
      "slug": slug.current
    }`
  );

  const top3 = leagues.slice(0, 3);
  const others = leagues.slice(3); // <-- only leagues NOT in the navbar

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + Desktop primary links */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Underserved Sports home"
            className="flex items-center rounded px-2 py-1 text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
          >
            Underserved Sports
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className={NAV_ITEM}>
              Home
            </Link>

            {top3.map((l) => (
              <Link key={l.slug} href={`/leagues/${l.slug}`} className={NAV_ITEM}>
                {l.name}
              </Link>
            ))}

            {/* More Leagues (only leagues NOT in top3) */}
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
                {others.length ? (
                  others.map((l) => (
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

          {/* Mobile panel */}
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="p-2">
              <Link href="/" className="block rounded px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                Home
              </Link>

              {/* Top 3 (shown in navbar on desktop) */}
              {top3.map((l) => (
                <Link
                  key={l.slug}
                  href={`/leagues/${l.slug}`}
                  className="block rounded px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                >
                  {l.name}
                </Link>
              ))}

              <div className="my-2 border-t" />

              {/* More Leagues (mobile: only 'others' to avoid duplicates) */}
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                More Leagues
              </div>
              {others.length ? (
                <ul className="max-h-64 overflow-auto">
                  {others.map((l) => (
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
      </div>
    </nav>
  );
}
