#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const localeConfig = require('../config/locales.json')

const DEFAULT_BASE_URL = process.env.STRUCTURE_AUDIT_BASE_URL || 'https://aiimagesplitter.com'
const DEFAULT_TIMEOUT_MS = 15000
const DEFAULT_MAX_REDIRECTS = 5
const DEFAULT_OUTPUT = ''

const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'
const SUPPORTED_LOCALES = localeConfig.locales || []
const RETIRED_LOCALES = localeConfig.retiredLocales || []
const DEPRECATED_QUERY_LOCALE_PARAM = (localeConfig.deprecatedQueryLocaleParam || 'lng').trim() || 'lng'

const CORE_ROUTES = ['/', '/privacy', '/terms', '/zh-CN', '/zh-CN/privacy', '/zh-CN/terms']
const CHECK_ROUTES = ['/', '/privacy', '/terms']

const BLOG_SUNSET_ROUTES = (() => {
  const routes = [
    '/blog',
    '/blog/',
    '/blog/complete-guide',
    '/blog/image-splitter-online',
    '/blog/__sunset_probe__'
  ]
  const nonDefaultLocales = SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

  nonDefaultLocales.forEach((locale) => {
    routes.push(`/${locale}/blog`)
    routes.push(`/${locale}/blog/complete-guide`)
    routes.push(`/${locale}/blog/image-splitter-online`)
    routes.push(`/${locale}/blog/__sunset_probe__`)
  })

  // Keep legacy default-locale path probes to prevent accidental route resurrection.
  routes.push(`/${DEFAULT_LOCALE}/blog`)
  routes.push(`/${DEFAULT_LOCALE}/blog/complete-guide`)
  routes.push(`/${DEFAULT_LOCALE}/blog/image-splitter-online`)
  routes.push(`/${DEFAULT_LOCALE}/blog/__sunset_probe__`)

  const firstLocale = nonDefaultLocales[0]
  const secondLocale = nonDefaultLocales[1] || firstLocale
  if (firstLocale && secondLocale) {
    routes.push(`/blog?${encodeURIComponent(DEPRECATED_QUERY_LOCALE_PARAM)}=${encodeURIComponent(firstLocale)}`)
    routes.push(`/${firstLocale}/blog?${encodeURIComponent(DEPRECATED_QUERY_LOCALE_PARAM)}=${encodeURIComponent(secondLocale)}`)
  }

  return Array.from(new Set(routes))
})()

const parseArgs = (argv) => {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    maxRedirects: DEFAULT_MAX_REDIRECTS,
    outputPath: DEFAULT_OUTPUT
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith('--base=')) {
      options.baseUrl = token.split('=').slice(1).join('=')
      continue
    }
    if (token === '--base') {
      options.baseUrl = argv[i + 1] || options.baseUrl
      i += 1
      continue
    }
    if (token.startsWith('--timeout=')) {
      options.timeoutMs = Number(token.split('=')[1] || options.timeoutMs)
      continue
    }
    if (token === '--timeout') {
      options.timeoutMs = Number(argv[i + 1] || options.timeoutMs)
      i += 1
      continue
    }
    if (token.startsWith('--max-redirects=')) {
      options.maxRedirects = Number(token.split('=')[1] || options.maxRedirects)
      continue
    }
    if (token === '--max-redirects') {
      options.maxRedirects = Number(argv[i + 1] || options.maxRedirects)
      i += 1
      continue
    }
    if (token.startsWith('--report=')) {
      options.outputPath = token.split('=').slice(1).join('=')
      continue
    }
    if (token === '--report') {
      options.outputPath = argv[i + 1] || options.outputPath
      i += 1
      continue
    }
    if (token.startsWith('--output=')) {
      options.outputPath = token.split('=').slice(1).join('=')
      continue
    }
    if (token === '--output') {
      options.outputPath = argv[i + 1] || options.outputPath
      i += 1
      continue
    }
  }

  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    options.timeoutMs = DEFAULT_TIMEOUT_MS
  }
  if (!Number.isFinite(options.maxRedirects) || options.maxRedirects <= 0) {
    options.maxRedirects = DEFAULT_MAX_REDIRECTS
  }

  options.baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
  return options
}

const isRedirectStatus = (status) => status >= 300 && status < 400

const requestWithRedirects = async ({
  url,
  timeoutMs,
  maxRedirects,
  method = 'GET',
  readBody = false
}) => {
  let currentUrl = url
  const history = []

  for (let step = 0; step <= maxRedirects; step += 1) {
    let response
    try {
      response = await fetch(currentUrl, {
        method,
        redirect: 'manual',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          'accept-language': 'en-US,en;q=0.9',
          'user-agent': 'site-structure-audit/1.0'
        }
      })
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        history
      }
    }

    const location = response.headers.get('location') || ''
    history.push({
      url: currentUrl,
      status: response.status,
      location
    })

    if (!isRedirectStatus(response.status) || !location) {
      const body = readBody ? await response.text() : ''
      return {
        ok: true,
        history,
        finalUrl: currentUrl,
        finalStatus: response.status,
        finalHeaders: response.headers,
        body
      }
    }

    if (step === maxRedirects) {
      return {
        ok: false,
        error: `Exceeded max redirects (${maxRedirects})`,
        history
      }
    }

    currentUrl = new URL(location, currentUrl).toString()
  }

  return {
    ok: false,
    error: 'Unexpected redirect handling failure',
    history
  }
}

const parseLinkTags = (html) => {
  const links = []
  const tagRegex = /<link\b[^>]*>/gi
  const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_:\-]*)\s*=\s*["']([^"']*)["']/g
  const tags = html.match(tagRegex) || []

  tags.forEach((tag) => {
    const attrs = {}
    let match
    while ((match = attrRegex.exec(tag)) !== null) {
      attrs[match[1].toLowerCase()] = match[2]
    }
    links.push(attrs)
  })

  return links
}

const extractAnchorHrefs = (html) => {
  const hrefs = []
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = anchorRegex.exec(html)) !== null) {
    hrefs.push(match[1])
  }
  return hrefs
}

const isSameHostUrl = (targetUrl, baseHost) => {
  try {
    const parsed = new URL(targetUrl)
    return parsed.host === baseHost
  } catch (error) {
    return false
  }
}

const toAbsoluteInternalUrl = (href, currentPageUrl, baseHost) => {
  if (!href) return null
  if (href.startsWith('#')) return null
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return null
  }

  try {
    const absolute = new URL(href, currentPageUrl)
    if (absolute.host !== baseHost) return null
    if (absolute.pathname.startsWith('/cdn-cgi/')) return null
    absolute.hash = ''
    return absolute.toString()
  } catch (error) {
    return null
  }
}

const fmtHistory = (history) =>
  history.map((entry) => `${entry.status}:${entry.url}${entry.location ? ` -> ${entry.location}` : ''}`).join(' | ')

const summarize = (text, max = 220) => {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  return `${cleaned.slice(0, max - 3)}...`
}

const createCheck = (item, passed, evidence, fix) => ({
  item,
  result: passed ? '通过' : '失败',
  passed,
  evidence,
  fix
})

const checkCoreRoutes = async (options) => {
  const failures = []
  const evidence = []
  const base = new URL(options.baseUrl)

  for (const route of CORE_ROUTES) {
    const url = `${options.baseUrl}${route}`
    const res = await requestWithRedirects({
      url,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects
    })

    if (!res.ok) {
      failures.push(`${route} 请求失败: ${res.error}`)
      continue
    }

    evidence.push(`${route} => ${res.finalStatus} (${fmtHistory(res.history)})`)
    if (res.finalStatus !== 200) {
      failures.push(`${route} 最终状态码为 ${res.finalStatus}`)
    }
  }

  const localeProbeUrl = `${options.baseUrl}/?${encodeURIComponent(DEPRECATED_QUERY_LOCALE_PARAM)}=zh-CN`
  const localeProbe = await requestWithRedirects({
    url: localeProbeUrl,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects
  })
  if (!localeProbe.ok) {
    failures.push(`遗留查询参数探针失败: ${localeProbe.error}`)
  } else {
    evidence.push(`/${DEPRECATED_QUERY_LOCALE_PARAM}=zh-CN => ${fmtHistory(localeProbe.history)}`)
    const firstHop = localeProbe.history[0]
    const finalHasDeprecatedParam = localeProbe.finalUrl.includes(`${DEPRECATED_QUERY_LOCALE_PARAM}=`)
    if (!isRedirectStatus(firstHop.status) || finalHasDeprecatedParam || localeProbe.finalStatus >= 400) {
      failures.push('遗留查询参数未被稳定重定向清理')
    }
  }

  const retiredProbeLocale = RETIRED_LOCALES[0]
  if (retiredProbeLocale) {
    const retiredProbe = await requestWithRedirects({
      url: `${options.baseUrl}/${retiredProbeLocale}`,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects
    })
    if (!retiredProbe.ok) {
      failures.push(`退役语言探针失败: ${retiredProbe.error}`)
    } else {
      evidence.push(`/${retiredProbeLocale} => ${fmtHistory(retiredProbe.history)}`)
      if (retiredProbe.finalStatus !== 410) {
        failures.push(`退役语言 /${retiredProbeLocale} 预期 410，实际 ${retiredProbe.finalStatus}`)
      }
    }
  }

  if (base.hostname !== 'localhost' && base.hostname !== '127.0.0.1' && !base.hostname.startsWith('www.')) {
    const wwwProbeUrl = `${base.protocol}//www.${base.hostname}${base.port ? `:${base.port}` : ''}/`
    const wwwProbe = await requestWithRedirects({
      url: wwwProbeUrl,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects
    })
    if (!wwwProbe.ok) {
      failures.push(`www 域名探针失败: ${wwwProbe.error}`)
    } else {
      evidence.push(`www redirect => ${fmtHistory(wwwProbe.history)}`)
      const sameHost = isSameHostUrl(wwwProbe.finalUrl, base.host)
      if (!sameHost || wwwProbe.finalStatus >= 400) {
        failures.push(`www 未正确回收至主域，最终 URL: ${wwwProbe.finalUrl}`)
      }
    }
  }

  return createCheck(
    '核心路由/重定向/退役语言状态',
    failures.length === 0,
    failures.length === 0 ? summarize(evidence.join(' || '), 460) : summarize(failures.join('；'), 460),
    '修复路由规则与 middleware：确保核心页 200、遗留 lng 参数 301 清理、退役语言 410、www 回收到主域。'
  )
}

const checkLegalLinks = async (options) => {
  const res = await requestWithRedirects({
    url: `${options.baseUrl}/`,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects,
    readBody: true
  })
  if (!res.ok || res.finalStatus >= 400) {
    return createCheck(
      '首页隐私/条款可抓取锚链接',
      false,
      `首页抓取失败：${res.ok ? `HTTP ${res.finalStatus}` : res.error}`,
      '先确保首页可访问，再检查 Footer 是否输出 <a href=\"/privacy\"> 与 <a href=\"/terms\">。'
    )
  }

  const hrefs = extractAnchorHrefs(res.body)
  const pageHost = new URL(res.finalUrl).host
  const internalUrls = hrefs
    .map((href) => toAbsoluteInternalUrl(href, res.finalUrl, pageHost))
    .filter(Boolean)
  const internalPaths = new Set(internalUrls.map((url) => new URL(url).pathname))

  const hasPrivacy = Array.from(internalPaths).some((pathname) => pathname === '/privacy' || pathname.endsWith('/privacy'))
  const hasTerms = Array.from(internalPaths).some((pathname) => pathname === '/terms' || pathname.endsWith('/terms'))

  return createCheck(
    '首页隐私/条款可抓取锚链接',
    hasPrivacy && hasTerms,
    `privacy=${hasPrivacy}, terms=${hasTerms}, homepage=${res.finalUrl}`,
    '将按钮跳转改为可抓取 <a> 锚链接，避免仅依赖 JS onClick/router.push。'
  )
}

const checkBlogSunsetRoutes = async (options) => {
  const failures = []
  const evidence = []

  for (const route of BLOG_SUNSET_ROUTES) {
    const url = `${options.baseUrl}${route}`
    const res = await requestWithRedirects({
      url,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects
    })

    if (!res.ok) {
      failures.push(`${route} 请求失败: ${res.error}`)
      continue
    }

    evidence.push(`${route} => ${fmtHistory(res.history)}`)
    if (res.finalStatus !== 410) {
      failures.push(`${route} 预期最终 410，实际 ${res.finalStatus}`)
    }
  }

  return createCheck(
    '博客下线路由状态（/blog* 最终 410）',
    failures.length === 0,
    failures.length === 0
      ? summarize(evidence.join(' || '), 460)
      : summarize(failures.join('；'), 460),
    '对已下线博客路由维持永久 410（允许中间 301/308），并保持 sitemap/内链不再暴露这些 URL。'
  )
}

const checkCanonicalAndHreflang = async (options) => {
  const failures = []
  const evidence = []
  const baseUrl = new URL(options.baseUrl)
  const baseHost = baseUrl.host
  const isLoopbackBase =
    baseUrl.hostname === 'localhost' ||
    baseUrl.hostname === '127.0.0.1' ||
    baseUrl.hostname === '::1'

  for (const route of CHECK_ROUTES) {
    const page = await requestWithRedirects({
      url: `${options.baseUrl}${route}`,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects,
      readBody: true
    })

    if (!page.ok || page.finalStatus >= 400) {
      failures.push(`${route} 抓取失败`)
      continue
    }

    const links = parseLinkTags(page.body)
    const canonical = links.find((link) => (link.rel || '').toLowerCase() === 'canonical')
    const alternates = links.filter(
      (link) => (link.rel || '').toLowerCase() === 'alternate' && link.hreflang && link.href
    )

    if (!canonical || !canonical.href) {
      failures.push(`${route} 缺 canonical`)
      continue
    }

    let canonicalUrl
    try {
      canonicalUrl = new URL(canonical.href)
    } catch (error) {
      failures.push(`${route} canonical 非绝对 URL: ${canonical.href}`)
      continue
    }

    // In CI/local loopback runs, canonical often points to production domain.
    // Keep host strict only for non-loopback audits.
    if (!isLoopbackBase && canonicalUrl.host !== baseHost) {
      failures.push(`${route} canonical 主机不一致: ${canonical.href}`)
    }
    if (canonicalUrl.search || canonicalUrl.hash) {
      failures.push(`${route} canonical 含 query/hash: ${canonical.href}`)
    }

    const hreflangSet = new Set(alternates.map((link) => String(link.hreflang || '').toLowerCase()))
    if (!hreflangSet.has('x-default')) {
      failures.push(`${route} 缺 x-default hreflang`)
    }
    if (!hreflangSet.has(String(DEFAULT_LOCALE).toLowerCase())) {
      failures.push(`${route} 缺默认语言 hreflang(${DEFAULT_LOCALE})`)
    }
    if (alternates.length < SUPPORTED_LOCALES.length) {
      failures.push(`${route} hreflang 数量不足，当前 ${alternates.length}`)
    }

    evidence.push(
      `${route}: canonical=${canonical.href}, hreflang=${alternates.length}${isLoopbackBase ? ', host-check=relaxed(loopback)' : ''}`
    )
  }

  return createCheck(
    'canonical 与 hreflang 结构',
    failures.length === 0,
    failures.length === 0 ? summarize(evidence.join(' || '), 460) : summarize(failures.join('；'), 460),
    '每个可索引页保留唯一 canonical（绝对 URL，无 query/hash），并输出完整 hreflang + x-default。'
  )
}

const checkInternalLinks = async (options) => {
  const failures = []
  const baseHost = new URL(options.baseUrl).host
  const sources = []

  for (const route of CHECK_ROUTES) {
    const page = await requestWithRedirects({
      url: `${options.baseUrl}${route}`,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects,
      readBody: true
    })
    if (!page.ok || page.finalStatus >= 400) {
      failures.push(`源页面 ${route} 无法抓取`)
      continue
    }

    sources.push(page)
  }

  const discoveredLinks = new Set()
  sources.forEach((page) => {
    const hrefs = extractAnchorHrefs(page.body)
    hrefs.forEach((href) => {
      const absolute = toAbsoluteInternalUrl(href, page.finalUrl, baseHost)
      if (absolute) {
        discoveredLinks.add(absolute)
      }
    })
  })

  const linksToCheck = Array.from(discoveredLinks).slice(0, 80)
  for (const link of linksToCheck) {
    const res = await requestWithRedirects({
      url: link,
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects
    })
    if (!res.ok) {
      failures.push(`${link} 请求失败: ${res.error}`)
      continue
    }
    if (res.finalStatus >= 400) {
      failures.push(`${link} 最终状态 ${res.finalStatus}`)
    }
  }

  return createCheck(
    '核心页面内部链接健康度',
    failures.length === 0,
    failures.length === 0
      ? `共检查 ${linksToCheck.length} 条内部链接，均可达`
      : summarize(failures.slice(0, 8).join('；'), 460),
    '修复 4xx/5xx 内链、错误重定向与多余路径；至少保证首页/隐私/条款中所有可抓取内链可达。'
  )
}

const checkCrawlFilesAndSecurityHeaders = async (options) => {
  const failures = []
  const evidence = []

  const homeRes = await requestWithRedirects({
    url: `${options.baseUrl}/`,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects
  })
  if (!homeRes.ok || homeRes.finalStatus >= 400) {
    failures.push('首页请求失败，无法检查安全响应头')
  } else {
    const frame = homeRes.finalHeaders.get('x-frame-options')
    const contentType = homeRes.finalHeaders.get('x-content-type-options')
    const referrer = homeRes.finalHeaders.get('referrer-policy')

    evidence.push(`x-frame-options=${frame || 'missing'}`)
    evidence.push(`x-content-type-options=${contentType || 'missing'}`)
    evidence.push(`referrer-policy=${referrer || 'missing'}`)

    if (String(frame || '').toUpperCase() !== 'DENY') {
      failures.push('缺少或错误的 X-Frame-Options=DENY')
    }
    if (String(contentType || '').toLowerCase() !== 'nosniff') {
      failures.push('缺少或错误的 X-Content-Type-Options=nosniff')
    }
    if (!referrer) {
      failures.push('缺少 Referrer-Policy')
    }
  }

  const robotsRes = await requestWithRedirects({
    url: `${options.baseUrl}/robots.txt`,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects,
    readBody: true
  })
  if (!robotsRes.ok || robotsRes.finalStatus !== 200) {
    failures.push('robots.txt 不可访问')
  } else {
    const hasSitemapLine = robotsRes.body.includes('Sitemap:')
    const hasDeprecatedParamRule = robotsRes.body.includes(`?${DEPRECATED_QUERY_LOCALE_PARAM}=`)
    evidence.push(`robots sitemap=${hasSitemapLine}, block-deprecated-param=${hasDeprecatedParamRule}`)
    if (!hasSitemapLine) {
      failures.push('robots.txt 缺 Sitemap 声明')
    }
  }

  const sitemapRes = await requestWithRedirects({
    url: `${options.baseUrl}/sitemap.xml`,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects,
    readBody: true
  })
  if (!sitemapRes.ok || sitemapRes.finalStatus !== 200) {
    failures.push('sitemap.xml 不可访问')
  } else {
    const hasUrlset = sitemapRes.body.includes('<urlset')
    const locMatches = sitemapRes.body.match(/<loc>(.*?)<\/loc>/g) || []
    const urls = locMatches.map((loc) => loc.replace('<loc>', '').replace('</loc>', ''))
    const hasPrivacy = urls.some((entry) => entry.endsWith('/privacy'))
    const hasTerms = urls.some((entry) => entry.endsWith('/terms'))

    evidence.push(`sitemap urlset=${hasUrlset}, loc-count=${urls.length}`)
    if (!hasUrlset || urls.length === 0) {
      failures.push('sitemap.xml 结构异常或无 URL')
    }
    if (!hasPrivacy || !hasTerms) {
      failures.push('sitemap 缺少隐私或条款 URL')
    }
  }

  return createCheck(
    'robots/sitemap 可抓取性 + 安全响应头基线',
    failures.length === 0,
    failures.length === 0 ? summarize(evidence.join(' || '), 460) : summarize(failures.join('；'), 460),
    '确保 robots/sitemap 始终 200 且内容完整；在全站返回安全响应头（X-Frame-Options、X-Content-Type-Options、Referrer-Policy）。'
  )
}

const printChecklist = (checks) => {
  console.log('\n[structure-audit] 当前项目逐项审计表（通过/失败/证据/修复建议）')
  console.log('| 项目 | 结果 | 证据 | 修复建议 |')
  console.log('| --- | --- | --- | --- |')
  checks.forEach((check) => {
    const evidence = summarize(check.evidence, 280).replace(/\|/g, '/')
    const fix = summarize(check.fix, 220).replace(/\|/g, '/')
    console.log(`| ${check.item} | ${check.result} | ${evidence} | ${fix} |`)
  })
}

const writeReport = (checks, options) => {
  if (!options.outputPath) return
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: options.baseUrl,
    timeoutMs: options.timeoutMs,
    maxRedirects: options.maxRedirects,
    summary: {
      total: checks.length,
      passed: checks.filter((item) => item.passed).length,
      failed: checks.filter((item) => !item.passed).length
    },
    checks
  }
  const outputPath = path.resolve(process.cwd(), options.outputPath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8')
  console.log(`[structure-audit] JSON report: ${outputPath}`)
}

const run = async () => {
  const options = parseArgs(process.argv.slice(2))
  console.log(`[structure-audit] base=${options.baseUrl}`)
  console.log(`[structure-audit] timeout=${options.timeoutMs}ms, maxRedirects=${options.maxRedirects}`)

  const checks = []
  checks.push(await checkCoreRoutes(options))
  checks.push(await checkBlogSunsetRoutes(options))
  checks.push(await checkLegalLinks(options))
  checks.push(await checkCanonicalAndHreflang(options))
  checks.push(await checkInternalLinks(options))
  checks.push(await checkCrawlFilesAndSecurityHeaders(options))

  printChecklist(checks)
  writeReport(checks, options)

  const failedCount = checks.filter((item) => !item.passed).length
  const passedCount = checks.length - failedCount
  console.log(`\n[structure-audit] 结果: ${passedCount}/${checks.length} 通过`)

  if (failedCount > 0) {
    process.exit(1)
  }
}

run().catch((error) => {
  console.error('[structure-audit] 运行失败:', error)
  process.exit(1)
})
