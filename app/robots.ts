import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard/', '/user-dashboard/'], 
    },
    sitemap: 'https://raga.space/sitemap.xml', 
  }
}
