import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Breadcrumbs, { type BreadcrumbItem } from '@/components/Breadcrumbs'

export const revalidate = 30

type ArticleData = {
  title: string
  slug: string
  excerpt?: string
  body?: PortableTextBlock[]
  imgUrl?: string
  imgAlt?: string | null
  league?: { name: string; slug: string } | null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const meta = await sanity.fetch<{ title?: string } | null>(
    `*[_type=="article" && slug.current==$slug][0]{ title }`,
    { slug }
  )
  return { title: meta?.title ?? 'Article' }
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const article = await sanity.fetch<ArticleData | null>(
    `*[_type=="article" && slug.current==$slug][0]{
      title,
      "slug": slug.current,
      excerpt,
      body,
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt,
      league->{ name, "slug": slug.current }
    }`,
    { slug }
  )

  if (!article) return notFound()

  const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]
  if (article.league?.slug) {
    crumbs.push({ label: 'Leagues', href: '/leagues' })
    crumbs.push({ label: article.league.name, href: `/leagues/${article.league.slug}` })
  }
  crumbs.push({ label: article.title })

  return (
    <main className="space-y-6">
      <Breadcrumbs items={crumbs} className="mt-2" />

      <header className="space-y-2">
        {article.league && (
          <Link
            href={`/leagues/${article.league.slug}`}
            className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
          >
            {article.league.name}
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
        {article.excerpt && <p className="text-slate-600">{article.excerpt}</p>}
      </header>

      {article.imgUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
          <Image
            src={article.imgUrl}
            alt={article.imgAlt || article.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <article className="prose prose-slate max-w-none">
        {Array.isArray(article.body) && article.body.length > 0 ? (
          <PortableText value={article.body} />
        ) : (
          <p>No content yet.</p>
        )}
      </article>
    </main>
  )
}
