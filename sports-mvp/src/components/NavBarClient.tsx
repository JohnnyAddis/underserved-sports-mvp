// src/components/NavBarClient.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export type LeagueLink = { name: string; slug: string }

type Props = {
  top3Desktop: LeagueLink[]
  othersDesktop: LeagueLink[]
  top5Mobile: LeagueLink[]
  othersMobile: LeagueLink[]
}

const NAV_ITEM =
  'rounded px-2 py-1 text-sm font-medium text-slate-800 hover:text-indigo-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

export default function NavBarClient({
  top3Desktop,
  othersDesktop,
  top5Mobile,
  othersMobile,
}: Props) {
  const pathname = usePathname() || '/'

  const isHome = pathname === '/'
  const isLeague = (slug: string) => pathname.startsWith(`/leagues/${slug}`)
  
  // Extract current league slug from pathname
  const currentLeagueSlug = pathname.match(/^\/leagues\/([^\/]+)/)?.[1]
  const isLeaguePage = !!currentLeagueSlug
  const isLeagueAboutPage = pathname === `/leagues/${currentLeagueSlug}/about`
  
  // Find current league details
  const allLeagues = [...(top3Desktop || []), ...(othersDesktop || [])]
  const currentLeague = currentLeagueSlug ? allLeagues.find(l => l.slug === currentLeagueSlug) : null
  
  // Get other leagues (excluding current)
  const otherLeaguesForDropdown = currentLeagueSlug 
    ? allLeagues.filter(l => l.slug !== currentLeagueSlug)
    : (othersDesktop || [])
  
  // For mobile menu
  const allLeaguesMobile = [...(top5Mobile || []), ...(othersMobile || [])]
  const otherLeaguesForDropdownMobile = currentLeagueSlug
    ? allLeaguesMobile.filter(l => l.slug !== currentLeagueSlug)
    : allLeaguesMobile

  // Refs to <details> so we can close them
  const desktopDetailsRef = useRef<HTMLDetailsElement>(null)
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null)

  const closeAllMenus = () => {
    if (desktopDetailsRef.current) desktopDetailsRef.current.open = false
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false
  }

  // 1) Close menus on route change
  useEffect(() => {
    closeAllMenus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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
            onClick={closeAllMenus} // 2) Close immediately on click
          >
            Underserved Sports
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`${NAV_ITEM} ${isHome ? 'text-indigo-700 bg-slate-50 ring-2 ring-indigo-500 ring-offset-0' : ''}`}
              aria-current={isHome ? 'page' : undefined}
              onClick={closeAllMenus} // close on click
            >
              Home
            </Link>

            {/* If on a league page, show current league + About + More Leagues */}
            {isLeaguePage && currentLeague ? (
              <>
                <Link
                  href={`/leagues/${currentLeague.slug}`}
                  className={`${NAV_ITEM} ${!isLeagueAboutPage ? 'text-indigo-700 bg-slate-50 ring-2 ring-indigo-500 ring-offset-0' : ''}`}
                  aria-current={!isLeagueAboutPage ? 'page' : undefined}
                  onClick={closeAllMenus}
                >
                  {currentLeague.name}
                </Link>
                <Link
                  href={`/leagues/${currentLeagueSlug}/about`}
                  className={`${NAV_ITEM} ${isLeagueAboutPage ? 'text-indigo-700 bg-slate-50 ring-2 ring-indigo-500 ring-offset-0' : ''}`}
                  aria-current={isLeagueAboutPage ? 'page' : undefined}
                  onClick={closeAllMenus}
                >
                  About
                </Link>
              </>
            ) : (
              /* Otherwise show top 3 leagues as before */
              top3Desktop.map((l) => {
                const active = isLeague(l.slug)
                return (
                  <Link
                    key={l.slug}
                    href={`/leagues/${l.slug}`}
                    className={`${NAV_ITEM} ${active ? 'text-indigo-700 bg-slate-50 ring-2 ring-indigo-500 ring-offset-0' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={closeAllMenus} // close on click
                  >
                    {l.name}
                  </Link>
                )
              })
            )}

            {/* More Leagues (desktop) */}
            <details className="relative" ref={desktopDetailsRef}>
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
                {otherLeaguesForDropdown.length ? (
                  otherLeaguesForDropdown.map((l) => {
                    const active = isLeague(l.slug)
                    return (
                      <li key={l.slug} role="none">
                        <Link
                          role="menuitem"
                          href={`/leagues/${l.slug}`}
                          className={`block rounded px-2 py-1 text-sm text-slate-800 hover:bg-slate-50 ${
                            active ? 'bg-slate-50 text-indigo-700' : ''
                          }`}
                          aria-current={active ? 'page' : undefined}
                          onClick={closeAllMenus} // close on click
                        >
                          {l.name}
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <li className="px-2 py-1 text-sm text-slate-500">No other leagues yet</li>
                )}
                <li className="mt-2 border-t pt-2" role="none">
                  <Link
                    role="menuitem"
                    href="/leagues"
                    className="block rounded px-2 py-1 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    onClick={closeAllMenus} // close on click
                  >
                    All Leagues
                  </Link>
                </li>
              </ul>
            </details>
          </div>
        </div>

        {/* Right: Mobile hamburger */}
        <details className="md:hidden relative" ref={mobileDetailsRef}>
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
              <Link
                href="/"
                className={`block rounded px-3 py-2 text-sm font-medium ${
                  isHome ? 'bg-slate-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-50'
                }`}
                aria-current={isHome ? 'page' : undefined}
                onClick={closeAllMenus} // close on click
              >
                Home
              </Link>

              {/* Show current league and About link when on a league page */}
              {isLeaguePage && currentLeague && (
                <>
                  <Link
                    href={`/leagues/${currentLeague.slug}`}
                    className={`block rounded px-3 py-2 text-sm font-medium ${
                      !isLeagueAboutPage ? 'bg-slate-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                    aria-current={!isLeagueAboutPage ? 'page' : undefined}
                    onClick={closeAllMenus}
                  >
                    {currentLeague.name}
                  </Link>
                  <Link
                    href={`/leagues/${currentLeagueSlug}/about`}
                    className={`block rounded px-3 py-2 text-sm font-medium ${
                      isLeagueAboutPage ? 'bg-slate-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                    aria-current={isLeagueAboutPage ? 'page' : undefined}
                    onClick={closeAllMenus}
                  >
                    About
                  </Link>
                </>
              )}

              <div className="my-2 border-t" />

              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isLeaguePage ? 'Other Leagues' : 'More Leagues'}
              </div>
              {otherLeaguesForDropdownMobile.length ? (
                <ul className="max-h-64 overflow-auto">
                  {otherLeaguesForDropdownMobile.map((l) => {
                    const active = isLeague(l.slug)
                    return (
                      <li key={l.slug}>
                        <Link
                          href={`/leagues/${l.slug}`}
                          className={`block rounded px-3 py-2 text-sm ${
                            active ? 'bg-slate-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-50'
                          }`}
                          aria-current={active ? 'page' : undefined}
                          onClick={closeAllMenus} // close on click
                        >
                          {l.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500">No other leagues yet</div>
              )}

              <div className="mt-2">
                <Link
                  href="/leagues"
                  className="block rounded px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  onClick={closeAllMenus} // close on click
                >
                  All Leagues
                </Link>
              </div>
            </div>
          </div>
        </details>
      </nav>

      {/* Mobile league rail (top 5) - only show when NOT on a league page */}
      {top5Mobile.length > 0 && !isLeaguePage && (
        <div className="md:hidden border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {top5Mobile.map((l) => {
                const active = isLeague(l.slug)
                return (
                  <Link
                    key={l.slug}
                    href={`/leagues/${l.slug}`}
                    className={`whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-sm font-medium hover:border-indigo-300 hover:bg-slate-50 ${
                      active ? 'border-indigo-400 bg-slate-50 text-indigo-700' : 'text-slate-800'
                    }`}
                    onClick={closeAllMenus} // close on click
                  >
                    {l.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
