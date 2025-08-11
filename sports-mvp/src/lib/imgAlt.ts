// se explicit alt when present; otherwise fall back to a sensible label.
export function imgAlt(primary?: string | null, fallback?: string) {
  const alt = (primary ?? '').trim()
  if (alt) return alt
  return (fallback ?? '').trim()
}
