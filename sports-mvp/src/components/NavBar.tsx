import Link from 'next/link'
import { sanity } from '@/lib/sanity'

type LeagueNavItem = {
  name: string
  slug: string
}

const NAV_ITEM =
  'rounded px-2 py-1 text-sm font-medium text-slate-800 hover:text-indigo-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

export default async function NavBar() {
  // Pull all leagues (sorted by name for now).
  // You can later add a "popularity" field in Sanity and sort by that.
  const leagues = await sanity.fetch<LeagueNavItem[]>(
    `*[_type=="league"]|order(name asc){
      "name": name,
      "slug": slug.current
    }`
  )

  const top3 = leagues.slice(0, 3)
  const others = leagues.slice(3)

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        {/* Brand — aligned with the rest via the same padding/line-height */}
        <Link
          href="/"
          aria-label="Underserved Sports home"
          className="flex items-center rounded px-2 py-1 text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
        >
          Underserved Sports
        </Link>

        {/* Primary nav items */}
        <div className="flex items-center gap-6">
          <Link href="/" className={NAV_ITEM}>
            Home
          </Link>

          {top3.map((l) => (
            <Link key={l.slug} href={`/leagues/${l.slug}`} className={NAV_ITEM}>
              {l.name}
            </Link>
          ))}

          {/* Accessible, JS-free dropdown using <details>/<summary> */}
          {others.length > 0 && (
            <details className="relative">
              <summary
                className={`${NAV_ITEM} list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden`}
              >
                More Leagues
              </summary>
              <ul className="absolute left-0 z-40 mt-2 w-56 overflow-auto rounded-lg border bg-white p-2 shadow-lg max-h-72">
                {others.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/leagues/${l.slug}`}
                      className="block rounded px-2 py-1 text-sm text-slate-800 hover:bg-slate-50"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
                {others.length === 0 && (
                  <li className="px-2 py-1 text-sm text-slate-500">No other leagues yet</li>
                )}
              </ul>
            </details>
          )}
        </div>
      </div>
    </nav>
  )
}
