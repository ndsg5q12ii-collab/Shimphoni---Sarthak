/** Resolves a path inside /public against the deployed base URL. */
export function publicAsset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** "images/a-800.avif 800w" entries → a srcset string resolved against the base URL. */
export function publicSrcSet(entries: string[]): string {
  return entries
    .map((entry) => {
      const [path, descriptor] = entry.trim().split(/\s+/)
      return `${publicAsset(path)}${descriptor ? ` ${descriptor}` : ''}`
    })
    .join(', ')
}
