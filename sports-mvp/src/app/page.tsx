import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'
import type { ArticleCard } from '@/types/content'

export const metadata = { title: 'Home' }

export default async function Home() {
  const articles = await sanity.fetch<ArticleCard[]>(`
    *[_type=="article"] | order(publishedAt desc)[0...6]{
      title,
      "slug": slug.current,
      excerpt,
      league->{ name, "slug": slug.current },
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt
    }
  `)

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Trending</h1>

      {articles.length === 0 ? (
        <p className="text-slate-600">No articles yet. Create one in Studio and publish.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: ArticleCard) => (
            <li key={a.slug} className="card overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/news/${a.slug}`} className="block" prefetch={false}>
                {a.imgUrl && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={a.imgUrl}
                      alt={a.imgAlt || a.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  {a.league && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {a.league.name}
                    </span>
                  )}
                  <h2 className="font-semibold">{a.title}</h2>
                  {a.excerpt && <p className="text-sm text-slate-600 line-clamp-2">{a.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
