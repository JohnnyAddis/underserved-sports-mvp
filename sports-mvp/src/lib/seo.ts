const FALLBACK = 'http://localhost:3000'

export const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || FALLBACK) as string

export function canonical(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${clean}`
}

/** Ensure OG image has proper size for previews */
export function ogImage(url?: string, w = 1200, h = 630) {
  if (!url) return undefined
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}w=${w}&h=${h}&fit=crop&auto=format`
}
