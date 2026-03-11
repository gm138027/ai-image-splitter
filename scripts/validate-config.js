#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const localeConfig = require('../config/locales.json')
const EXPECTED_LOCALES = localeConfig.locales
const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'
const SUPPORTED_LOCALES_LOWER = new Set(EXPECTED_LOCALES.map(locale => locale.toLowerCase()))

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

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const findCaseInsensitiveDuplicates = (values) => {
  const seen = new Set()
  const duplicates = new Set()

  values.forEach(value => {
    const normalized = value.toLowerCase()
    if (seen.has(normalized)) {
      duplicates.add(normalized)
    } else {
      seen.add(normalized)
    }
  })

  return Array.from(duplicates)
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

} catch (error) {
  console.log('[error] Failed to read public/robots.txt: ' + error.message)
  hasErrors = true
}

logSection('Checking locale governance fields')
try {
  const retiredLocales = localeConfig.retiredLocales || []
  const retiredLocaleAliases = localeConfig.retiredLocaleAliases || []
  const legacyLocaleRedirects = localeConfig.legacyLocaleRedirects || {}
  const deprecatedQueryLocaleParam = localeConfig.deprecatedQueryLocaleParam

  if (!Array.isArray(retiredLocales)) {
    console.log('[error] retiredLocales must be an array')
    hasErrors = true
  }
  if (!Array.isArray(retiredLocaleAliases)) {
    console.log('[error] retiredLocaleAliases must be an array')
    hasErrors = true
  }
  if (typeof legacyLocaleRedirects !== 'object' || legacyLocaleRedirects === null || Array.isArray(legacyLocaleRedirects)) {
    console.log('[error] legacyLocaleRedirects must be an object map')
    hasErrors = true
  }
  if (!isNonEmptyString(deprecatedQueryLocaleParam)) {
    console.log('[error] deprecatedQueryLocaleParam must be a non-empty string')
    hasErrors = true
  }

  const retiredTokens = [...retiredLocales, ...retiredLocaleAliases]
  const nonStringRetired = retiredTokens.filter(token => !isNonEmptyString(token))
  if (nonStringRetired.length > 0) {
    console.log('[error] retiredLocales/retiredLocaleAliases contain invalid values')
    hasErrors = true
  }

  const normalizedRetiredTokens = retiredTokens
    .filter(isNonEmptyString)
    .map(token => token.trim().toLowerCase())

  const retiredDuplicates = findCaseInsensitiveDuplicates(normalizedRetiredTokens)
  if (retiredDuplicates.length > 0) {
    console.log('[error] duplicate retired locale tokens found: ' + retiredDuplicates.join(', '))
    hasErrors = true
  }

  const conflictsWithSupported = normalizedRetiredTokens.filter(token => SUPPORTED_LOCALES_LOWER.has(token))
  if (conflictsWithSupported.length > 0) {
    console.log('[error] retired locale tokens conflict with supported locales: ' + Array.from(new Set(conflictsWithSupported)).join(', '))
    hasErrors = true
  }

  Object.entries(legacyLocaleRedirects).forEach(([rawSource, rawTarget]) => {
    const source = String(rawSource || '').trim()
    const sourceLower = source.toLowerCase()
    const target = String(rawTarget || '').trim()
    const targetLower = target.toLowerCase()

    if (!isNonEmptyString(source) || !isNonEmptyString(target)) {
      console.log('[error] legacyLocaleRedirects contains empty source/target')
      hasErrors = true
      return
    }

    if (source !== sourceLower) {
      console.log('[error] legacyLocaleRedirects source key must be lowercase: ' + source)
      hasErrors = true
    }

    if (!EXPECTED_LOCALES.includes(target)) {
      console.log('[error] legacyLocaleRedirects target must be a supported locale: ' + source + ' -> ' + target)
      hasErrors = true
    }

    if (SUPPORTED_LOCALES_LOWER.has(sourceLower)) {
      console.log('[error] legacyLocaleRedirects source should not be a supported locale: ' + source)
      hasErrors = true
    }

    if (sourceLower === targetLower) {
      console.log('[error] legacyLocaleRedirects contains self-redirect: ' + source + ' -> ' + target)
      hasErrors = true
    }
  })

  if (!hasErrors) {
    console.log('[ok] locale governance fields are valid')
  }
} catch (error) {
  console.log('[error] Failed to validate locale governance fields: ' + error.message)
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
