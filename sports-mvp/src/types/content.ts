export type ArticleListItem = {
  title: string
  slug: string
  excerpt?: string
  league?: { name: string; slug: string }
}