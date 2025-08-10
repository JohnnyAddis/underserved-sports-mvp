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

export type LeagueRef = { name: string; slug: string }

export type ArticleDetail = {
  title: string
  excerpt?: string
  imgUrl?: string
  imgAlt?: string
  body?: PortableTextBlock[]
  publishedAt?: string
  updatedAt?: string
  league?: LeagueRef
  tags?: string[]
  sources?: string[]
}

export type RelatedArticle = { title: string; slug: string }
