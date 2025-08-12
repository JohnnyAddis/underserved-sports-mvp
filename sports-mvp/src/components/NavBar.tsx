// src/components/NavBar.tsx
import { sanity } from '@/lib/sanity'
import NavBarClient, { type LeagueLink } from './NavBarClient'

type LeagueRow = {
  name: string
  slug: string
  featuredRank?: number | null
  count: number
}

function pickTopByFeaturedOrCount(rows: LeagueRow[], n: number): LeagueLink[] {
  const ranked = rows
    .filter((r) => typeof r.featuredRank === 'number')
    .sort((a, b) => (a.featuredRank! - b.featuredRank!))
  if (ranked.length > 0) {
    const take = ranked.slice(0, n).map((r) => ({ name: r.name, slug: r.slug }))
    if (take.length < n) {
      const chosen = new Set(take.map((t) => t.slug))
      const byCount = rows
        .filter((r) => !chosen.has(r.slug))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, n - take.length)
        .map((r) => ({ name: r.name, slug: r.slug }))
      return [...take, ...byCount]
    }
    return take
  }
  return rows
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, n)
    .map((r) => ({ name: r.name, slug: r.slug }))
}

export default async function NavBar() {
  const rows = await sanity.fetch<LeagueRow[]>(`
    *[_type=="league"]{
      name,
      "slug": slug.current,
      featuredRank,
      "count": count(*[_type=="article" && references(^._id)])
    }
  `)

  const top3Desktop = pickTopByFeaturedOrCount(rows, 3)
  const top5Mobile = pickTopByFeaturedOrCount(rows, 5)

  const top3Slugs = new Set(top3Desktop.map((l) => l.slug))
  const top5Slugs = new Set(top5Mobile.map((l) => l.slug))

  const othersDesktop: LeagueLink[] = rows
    .filter((r) => !top3Slugs.has(r.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => ({ name: r.name, slug: r.slug }))

  const othersMobile: LeagueLink[] = rows
    .filter((r) => !top5Slugs.has(r.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => ({ name: r.name, slug: r.slug }))

  return (
    <NavBarClient
      top3Desktop={top3Desktop}
      othersDesktop={othersDesktop}
      top5Mobile={top5Mobile}
      othersMobile={othersMobile}
    />
  )
}
