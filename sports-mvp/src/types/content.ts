import type { PortableTextBlock } from '@portabletext/types'

export type LeagueListItem = {
  name: string
  slug: string
  logoUrl?: string
}

export type ArticleListItem = {
  title: string
  slug: string
  excerpt?: string
  league?: { name: string; slug: string }
  imgUrl?: string
  imgAlt?: string
}

export type ArticleDetail = {
  title: string
  slug: string
  excerpt?: string
  body?: PortableTextBlock[]
  imgUrl?: string
  imgAlt?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  sources?: string[]
  league?: { name: string; slug: string }
  author?: { name?: string }
}

export type RelatedArticle = {
  title: string
  slug: string
}
