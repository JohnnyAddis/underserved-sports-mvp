import type { PortableTextBlock } from '@portabletext/types'

export type ArticleCard = {
  title: string
  slug: string
  excerpt?: string
  league?: { name: string; slug: string }
  imgUrl?: string
  imgAlt?: string | null
}

export type LeagueListItem = {
  name: string
  slug: string
  logoUrl?: string
  count: number
}

export type LeagueData = {
  name: string
  about?: PortableTextBlock[]
  logoUrl?: string
}

export type LeagueArticle = {
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  imgAlt?: string | null
}
