/**
 * Dynamically generate sitemap.xml
 * Uses unified language configuration to ensure consistency with code configuration
 */

const fs = require('fs')
const path = require('path')

// Import language list from configuration file (unified source)
const { SUPPORTED_LOCALES } = require('../src/lib/urlUtils')

const BASE_URL = 'https://aiimagesplitter.com'

// Add timestamps
const now = new Date().toISOString()
const today = now.split('T')[0]

// Priority configuration
const priorities = {
  homepage: '1.0',
  mainPages: '0.8',
  blogPosts: '0.6'
}

// Page configuration
const PAGES = [
  {
    path: '',
    priority: priorities.homepage,
    changefreq: 'daily'
  },
  {
    path: '/blog',
    priority: priorities.mainPages,
    changefreq: 'weekly'
  },
  {
    path: '/privacy',
    priority: priorities.mainPages,
    changefreq: 'monthly'
  },
  {
    path: '/terms',
    priority: priorities.mainPages,
    changefreq: 'monthly'
  }
]

/**
 * Generate URL list for specific page
 */
function generatePageUrls(pagePath) {
  const urls = []
  
  SUPPORTED_LOCALES.forEach(locale => {
    if (locale === 'en') {
      // Main URL (English version)
      urls.push(`${BASE_URL}${pagePath}`)
    } else {
      // Generate hreflang links for all language versions
      urls.push(`${BASE_URL}/${locale}${pagePath}`)
    }
  })
  
  return urls
}

/**
 * Generate sitemap entry for single page
 */
function generateUrlEntry(url, priority, changefreq) {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

/**
 * Generate complete sitemap.xml
 */
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  PAGES.forEach(page => {
    const urls = generatePageUrls(page.path)
    
    urls.forEach(url => {
      sitemap += generateUrlEntry(url, page.priority, page.changefreq)
    })
  })

  sitemap += '\n</urlset>'
  return sitemap
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting sitemap.xml generation...')
  
  const sitemap = generateSitemap()
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  
  fs.writeFileSync(outputPath, sitemap, 'utf8')
  
  console.log('✅ sitemap.xml generated successfully!')
  console.log(`📍 File location: ${outputPath}`)
  console.log(`📊 Pages included: ${PAGES.length}`)
  console.log(`🌍 Languages supported: ${SUPPORTED_LOCALES.length}`)
  
  // Validate generated file
  if (fs.existsSync(outputPath)) {
    const fileSize = fs.statSync(outputPath).size
    console.log(`📁 File size: ${fileSize} bytes`)
    
    if (fileSize > 0) {
      console.log('🎉 Sitemap generation completed successfully!')
    } else {
      console.error('❌ Generated file is empty!')
      process.exit(1)
    }
  } else {
    console.error('❌ File generation failed!')
    process.exit(1)
  }
}

// Run main function
if (require.main === module) {
  main()
}

module.exports = {
  generateSitemap,
  generatePageUrls,
  PAGES,
  SUPPORTED_LOCALES
} 