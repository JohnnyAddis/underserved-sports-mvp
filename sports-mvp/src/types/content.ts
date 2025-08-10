// src/types/content.ts
import type { PortableTextBlock } from '@portabletext/types'

/** For the Leagues index grid */
export type LeagueListItem = {
  name: string
  slug: string
  logoUrl?: string
}

/** For the Home “Trending” cards (and other article lists) */
export type ArticleListItem = {
  title: string
  slug: string
  excerpt?: string
  league?: { name: string; slug: string }
  imgUrl?: string
  imgAlt?: string
}

/** Small reusable league reference */
export type LeagueRef = { name: string; slug: string }

/** Full article detail page shape */
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

/** For “Related articles” lists */
export type RelatedArticle = { title: string; slug: string }
