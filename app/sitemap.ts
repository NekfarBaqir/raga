import { MetadataRoute } from 'next'

const BASE_URL = 'https://raga.space'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
    { url: `${BASE_URL}/apply`, lastModified: new Date() },
  ]

  return pages
}
