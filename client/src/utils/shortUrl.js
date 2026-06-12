/**
 * Returns the correct short URL for a link, using the backend BASE_URL.
 * Short URLs must point to the backend server (which handles redirects),
 * NOT the frontend origin.
 */
export const getShortUrl = (link) => {
  if (!link) return ''
  const base = (import.meta.env.VITE_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
  const code = link.customAlias || link.shortCode
  return `${base}/${code}`
}

/**
 * Returns just the short code portion (alias or auto-generated code).
 */
export const getShortCode = (link) => {
  if (!link) return ''
  return link.customAlias || link.shortCode
}
