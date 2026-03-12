/**
 * Dynamically generate sitemap.xml
 * Pulls locale configuration from a shared JSON file to avoid duplication.
 */

const fs = require('fs')
const path = require('path')
const localeConfig = require('../config/locales.json')

const SUPPORTED_LOCALES = localeConfig.locales
const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'

console.log('Sitemap generation using locales:', SUPPORTED_LOCALES.join(', '))

const BASE_URL = 'https://aiimagesplitter.com'

const today = new Date().toISOString().split('T')[0]

const priorities = {
  homepage: '1.0',
  mainPages: '0.8',
}

const PAGES = [
  { path: '', priority: priorities.homepage, changefreq: 'daily' },
  { path: '/privacy', priority: priorities.mainPages, changefreq: 'monthly' },
  { path: '/terms', priority: priorities.mainPages, changefreq: 'monthly' },
]

function generatePageUrls(pagePath) {
  return SUPPORTED_LOCALES.map(locale => {
    if (locale === DEFAULT_LOCALE) {
      return `${BASE_URL}${pagePath}`
    }
    return `${BASE_URL}/${locale}${pagePath}`
  })
}

function generateUrlEntry(url, priority, changefreq) {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  PAGES.forEach(page => {
    generatePageUrls(page.path).forEach(url => {
      sitemap += generateUrlEntry(url, page.priority, page.changefreq)
    })
  })

  sitemap += '\n</urlset>'
  return sitemap
}

function main() {
  console.log('[sitemap] Starting sitemap.xml generation...')

  const sitemap = generateSitemap()
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')

  fs.writeFileSync(outputPath, sitemap, 'utf8')

  console.log('[sitemap] sitemap.xml generated successfully')
  console.log('[sitemap] File location:', outputPath)
  console.log('[sitemap] Total logical pages:', PAGES.length)
  console.log('[sitemap] Locales per page:', SUPPORTED_LOCALES.length)

  if (!fs.existsSync(outputPath)) {
    console.error('[sitemap] File generation failed')
    process.exit(1)
  }

  const fileSize = fs.statSync(outputPath).size
  console.log('[sitemap] Output file size:', fileSize, 'bytes')

  if (fileSize <= 0) {
    console.error('[sitemap] Generated file is empty')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  generateSitemap,
  generatePageUrls,
  PAGES,
  SUPPORTED_LOCALES,
}
