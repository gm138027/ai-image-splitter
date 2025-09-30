#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const localeConfig = require('../config/locales.json')
const EXPECTED_LOCALES = localeConfig.locales
const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'

const logSection = (title) => {
  console.log('\n[validate-config] ' + title)
}

let hasErrors = false

const reportMismatch = (context, missing) => {
  if (missing.length === 0) {
    console.log('[ok] ' + context + ' includes all locales')
    return
  }
  console.log('[error] ' + context + ' is missing locales: ' + missing.join(', '))
  hasErrors = true
}

logSection('Checking next-i18next configuration')
try {
  const nextConfig = require('../next-i18next.config.js')
  reportMismatch('next-i18next.config.js', EXPECTED_LOCALES.filter(locale => !nextConfig.i18n.locales.includes(locale)))
  if ((nextConfig.i18n.defaultLocale || '') !== DEFAULT_LOCALE) {
    console.log('[error] next-i18next defaultLocale expected "' + DEFAULT_LOCALE + '" but found "' + nextConfig.i18n.defaultLocale + '"')
    hasErrors = true
  }
} catch (error) {
  console.log('[error] Failed to load next-i18next.config.js: ' + error.message)
  hasErrors = true
}

logSection('Checking sitemap generator')
try {
  const sitemapModule = require('./generate-sitemap.js')
  reportMismatch('generate-sitemap.js', EXPECTED_LOCALES.filter(locale => !sitemapModule.SUPPORTED_LOCALES.includes(locale)))
} catch (error) {
  console.log('[error] Failed to load scripts/generate-sitemap.js: ' + error.message)
  hasErrors = true
}

logSection('Checking robots.txt')
try {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
  const robotsContent = fs.readFileSync(robotsPath, 'utf8')
  const missingAllows = EXPECTED_LOCALES
    .filter(locale => locale !== DEFAULT_LOCALE)
    .filter(locale => !robotsContent.includes('Allow: /' + locale))

  if (missingAllows.length > 0) {
    console.log('[warn] robots.txt is missing Allow directives for: ' + missingAllows.join(', '))
  } else {
    console.log('[ok] robots.txt includes Allow directives for all locales')
  }

  if (!robotsContent.includes('Disallow: /fil')) {
    console.log('[warn] robots.txt is missing Disallow rule for legacy /fil path')
  }
} catch (error) {
  console.log('[error] Failed to read public/robots.txt: ' + error.message)
  hasErrors = true
}

logSection('Checking seo.ts locale import')
try {
  const seoConfigPath = path.join(process.cwd(), 'src/config/seo.ts')
  const seoContent = fs.readFileSync(seoConfigPath, 'utf8')
  if (!seoContent.includes('config/locales.json')) {
    console.log('[warn] src/config/seo.ts does not appear to import config/locales.json')
  } else {
    console.log('[ok] src/config/seo.ts imports shared locale configuration')
  }
} catch (error) {
  console.log('[error] Failed to read src/config/seo.ts: ' + error.message)
  hasErrors = true
}

console.log('\n' + '='.repeat(48))
if (hasErrors) {
  console.log('[validate-config] Validation failed')
  process.exit(1)
}

console.log('[validate-config] All checks passed')
process.exit(0)
