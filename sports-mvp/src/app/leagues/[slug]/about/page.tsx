// src/app/leagues/[slug]/about/page.tsx
import { sanity } from '@/lib/sanity'
import { generateSEOMetadata } from '@/lib/seo-utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

type Team = {
  name: string
  founded?: string
  location?: string
  stadium?: string
  description?: string
}

type Stat = {
  label: string
  value: string
}

type Champion = {
  year: string
  team: string
  runnerUp?: string
  notes?: string
}

type LeagueEvergreenData = {
  leagueName: string
  leagueSlug: string
  logoUrl?: string | null
  history?: PortableTextBlock[]
  format?: PortableTextBlock[]
  teams?: Team[]
  stats?: Stat[]
  champions?: Champion[]
  metaTitle?: string
  metaDescription?: string
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const data = await sanity.fetch<{
      leagueName?: string
      logoUrl?: string | null
      metaTitle?: string
      metaDescription?: string
    } | null>(
      `*[_type=="leagueEvergreen" && league->slug.current==$slug][0]{
        "leagueName": league->name,
        "logoUrl": league->logo.asset->url,
        metaTitle,
        metaDescription
      }`,
      { slug }
    )
    
    if (data) {
      return {
        title: data.metaTitle || `About ${data.leagueName}` || 'League Information',
        description: data.metaDescription || `Learn about ${data.leagueName || 'this league'} - history, teams, format, and champions.`,
        openGraph: {
          title: data.metaTitle || `About ${data.leagueName}` || 'League Information',
          description: data.metaDescription || `Learn about ${data.leagueName || 'this league'}`,
          images: data.logoUrl ? [{ url: data.logoUrl }] : undefined,
        },
      }
    }
    
    // Fallback to basic league data
    const leagueData = await sanity.fetch<{ name?: string } | null>(
      `*[_type=="league" && slug.current==$slug][0]{ name }`,
      { slug }
    )
    
    return {
      title: leagueData?.name ? `About ${leagueData.name}` : 'League Information',
      description: leagueData?.name ? `Learn about ${leagueData.name} - history, teams, format, and champions.` : 'League information and history.',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'League Information',
      description: 'League information and history.',
    }
  }
}

export default async function LeagueAboutPage({ params }: PageParams) {
  const { slug } = await params

  const data = await sanity.fetch<LeagueEvergreenData>(
    `
    *[_type=="leagueEvergreen" && league->slug.current==$slug][0]{
      "leagueName": league->name,
      "leagueSlug": league->slug.current,
      "logoUrl": league->logo.asset->url,
      history,
      format,
      teams,
      stats,
      champions,
      metaTitle,
      metaDescription
    }
  `,
    { slug }
  )

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold">League information not found</h1>
        <p className="text-slate-600">
          This league doesn&apos;t have an about page yet. Go back to{' '}
          <Link className="text-indigo-600 underline" href={`/leagues/${slug}`}>
            {slug} news
          </Link>
          .
        </p>
      </div>
    )
  }

  const { leagueName, logoUrl, history, format, teams, stats, champions } = data

  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-semibold">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>,
      normal: ({ children }) => <p className="mb-3 leading-relaxed text-slate-700">{children}</p>,
    },
    list: {
      bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
      number: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="text-slate-700">{children}</li>,
      number: ({ children }) => <li className="text-slate-700">{children}</li>,
    },
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <header className="mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${leagueName} logo`} className="h-16 w-16 rounded-lg border object-contain" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{leagueName}</h1>
            <p className="mt-1 text-sm text-slate-600">League Information & History</p>
          </div>
        </div>
      </header>

      {/* Key Statistics */}
      {stats && stats.length > 0 && (
        <section className="mb-8 rounded-lg bg-slate-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Facts</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <dt className="text-sm text-slate-600">{stat.label}</dt>
                <dd className="text-lg font-semibold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* League History */}
      {history && history.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">History</h2>
          <div className="prose prose-slate max-w-none">
            <PortableText value={history} components={components} />
          </div>
        </section>
      )}

      {/* League Format */}
      {format && format.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">League Format</h2>
          <div className="prose prose-slate max-w-none">
            <PortableText value={format} components={components} />
          </div>
        </section>
      )}

      {/* Teams */}
      {teams && teams.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Teams</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, index) => (
              <div key={index} className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{team.name}</h3>
                {team.location && (
                  <p className="text-sm text-slate-600 mt-1">
                    📍 {team.location}
                  </p>
                )}
                {team.stadium && (
                  <p className="text-sm text-slate-600">
                    🏟️ {team.stadium}
                  </p>
                )}
                {team.founded && (
                  <p className="text-sm text-slate-600">
                    Est. {team.founded}
                  </p>
                )}
                {team.description && (
                  <p className="mt-2 text-sm text-slate-700">{team.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Champions */}
      {champions && champions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Past Champions</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2 text-left font-semibold">Year</th>
                  <th className="px-4 py-2 text-left font-semibold">Champion</th>
                  {champions.some(c => c.runnerUp) && (
                    <th className="px-4 py-2 text-left font-semibold">Runner-up</th>
                  )}
                  {champions.some(c => c.notes) && (
                    <th className="px-4 py-2 text-left font-semibold">Notes</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {champions.map((champion, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{champion.year}</td>
                    <td className="px-4 py-2">{champion.team}</td>
                    {champions.some(c => c.runnerUp) && (
                      <td className="px-4 py-2 text-slate-600">{champion.runnerUp || '-'}</td>
                    )}
                    {champions.some(c => c.notes) && (
                      <td className="px-4 py-2 text-sm text-slate-600">{champion.notes || '-'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Back to League link */}
      <div className="mt-12 border-t pt-6">
        <Link
          href={`/leagues/${data.leagueSlug}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          ← Back to {leagueName} News
        </Link>
      </div>
    </div>
  )
}