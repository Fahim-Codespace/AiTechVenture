import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()

  const routes = [
    '/',
    '/tech',
    '/ai-models',
    '/news',
    '/newsletter',
    '/unsubscribe',
    '/resources',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const now = new Date()

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/news' ? 'hourly' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}

