import Image from 'next/image'
import { notFound } from 'next/navigation'
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type ArticleDetail = {
  title: string
  excerpt?: string
  slug: string
  body?: PortableTextBlock[]
  imgUrl?: string
  imgAlt?: string | null
  publishedAt?: string
  league?: { name: string; slug: string } | null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const meta = await sanity.fetch<
    { title?: string; metaTitle?: string; metaDescription?: string; imgUrl?: string } | null
  >(
    `*[_type=="article" && slug.current==$slug][0]{
      title, metaTitle, metaDescription,
      "imgUrl": heroImage.asset->url
    }`,
    { slug }
  )

  if (!meta) return {}

  return {
    title: meta.metaTitle || meta.title || 'Article',
    description: meta.metaDescription || undefined,
    openGraph: {
      title: meta.metaTitle || meta.title || 'Article',
      description: meta.metaDescription || undefined,
      images: meta.imgUrl ? [{ url: meta.imgUrl }] : undefined,
    },
  }
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const article = await sanity.fetch<ArticleDetail | null>(
    `*[_type=="article" && slug.current==$slug][0]{
      title,
      "slug": slug.current,
      excerpt,
      body,
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt,
      publishedAt,
      league->{ name, "slug": slug.current }
    }`,
    { slug }
  )

  if (!article) return notFound()

  return (
    <main className="space-y-6">
      <article className="prose lg:prose-lg max-w-none">
        {article.imgUrl && (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={article.imgUrl}
              alt={article.imgAlt || article.title}
              fill
              sizes="100vw"
              className="object-cover rounded-xl"
              priority
            />
          </div>
        )}

        <h1 className="!mb-2">{article.title}</h1>
        {article.excerpt && <p className="lead">{article.excerpt}</p>}

        {Array.isArray(article.body) && article.body.length > 0 ? (
          <PortableText value={article.body} />
        ) : (
          <p className="text-slate-600">No content yet.</p>
        )}
      </article>
    </main>
  )
}
