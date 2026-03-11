#!/usr/bin/env node

/**
 * URL验证和清理脚本
 * 检测和报告URL重复问题，生成重定向建议
 */

const fs = require('fs')
const path = require('path')

// 模拟URLCleaner功能（避免TS编译问题）
const localeConfig = require('../config/locales.json')
const SUPPORTED_LOCALES = localeConfig.locales
const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'
const RETIRED_LOCALES = new Set(['hi', 'ms', 'tl', 'kk'])
const RETIRED_LOCALE_ALIASES = new Set(['fil', 'filipino', 'kz'])
const RETIRED_LOCALE_LIST = [...RETIRED_LOCALES, ...RETIRED_LOCALE_ALIASES]

const isRetiredLocale = (locale) => RETIRED_LOCALES.has(locale) || RETIRED_LOCALE_ALIASES.has(locale)

const BASE_URL = 'https://aiimagesplitter.com'

console.log('🔍 开始URL验证和清理分析...\n')

// 1. 定义基础页面路径
const basePaths = [
  '/',
  '/blog',
  '/blog/complete-guide',
  '/privacy',
  '/terms'
]

// 2. 生成所有可能的URL变体（包括问题URL）
const generateTestURLs = () => {
  const urls = []
  
  // 正确的URL格式
  basePaths.forEach(path => {
    // 默认语言
    urls.push(`${BASE_URL}${path}`)
    
    // 其他语言
    SUPPORTED_LOCALES.filter(locale => locale !== DEFAULT_LOCALE).forEach(locale => {
      urls.push(`${BASE_URL}/${locale}${path}`)
    })
  })
  
  // 问题URL格式
  basePaths.forEach(path => {
    // 查询参数格式
    SUPPORTED_LOCALES.forEach(locale => {
      if (locale !== DEFAULT_LOCALE) {
        urls.push(`${BASE_URL}${path}?lng=${locale}`)
      }
    })
    
    // Retired locale query params (should be stripped from URL)
    RETIRED_LOCALE_LIST.forEach(locale => {
      urls.push(`${BASE_URL}${path}?lng=${locale}`)
    })

    // Retired locale paths (expected 410)
    RETIRED_LOCALE_LIST.forEach(locale => {
      urls.push(`${BASE_URL}/${locale}${path}`)
    })
    
    // 尾部斜杠问题
    if (path !== '/') {
      urls.push(`${BASE_URL}${path}/`)
      urls.push(`${BASE_URL}/zh-CN${path}/`)
    }
  })
  
  return urls
}

// 3. URL分析函数
const analyzeURL = (url) => {
  const analysis = {
    original: url,
    canonical: '',
    isValid: true,
    issues: [],
    redirectTo: null
  }
  
  try {
    const urlObj = new URL(url)
    const { pathname, searchParams } = urlObj
    
    // 检查查询参数
    const lngParam = searchParams.get('lng')
    if (lngParam) {
      const lngParamClean = lngParam.trim()
      const lngParamLower = lngParamClean.toLowerCase()
      analysis.issues.push('Uses legacy locale query parameter (lng=)')
      analysis.isValid = false

      // Query-based locale is deprecated. Always canonicalize to path-based URL.
      analysis.redirectTo = `${BASE_URL}${pathname}`
      if (isRetiredLocale(lngParamLower)) {
        analysis.issues.push('Retired locale query should be removed from URL')
      } else if (
        lngParamClean !== DEFAULT_LOCALE &&
        !SUPPORTED_LOCALES.includes(lngParamClean)
      ) {
        analysis.issues.push('Unsupported locale in query parameter')
      }
    }
    
    // 检查路径
    const pathSegments = pathname.split('/').filter(Boolean)
    let locale = DEFAULT_LOCALE
    let contentPath = pathname
    
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0]
      const firstSegmentLower = firstSegment.toLowerCase()
      
      if (isRetiredLocale(firstSegmentLower)) {
        analysis.issues.push('Retired locale path should return 410')
        analysis.isValid = false
        analysis.redirectTo = null
      } else if (SUPPORTED_LOCALES.includes(firstSegment)) {
        locale = firstSegment
        contentPath = '/' + pathSegments.slice(1).join('/')
      }
    }
    
    // 检查尾部斜杠
    if (pathname !== '/' && pathname.endsWith('/')) {
      analysis.issues.push('包含不必要的尾部斜杠')
      analysis.isValid = false
      if (!analysis.redirectTo) {
        analysis.redirectTo = url.replace(/\/$/, '')
      }
    }
    
    // 生成canonical URL
    if (locale === DEFAULT_LOCALE) {
      analysis.canonical = `${BASE_URL}${contentPath}`
    } else {
      analysis.canonical = `${BASE_URL}/${locale}${contentPath}`
    }
    
  } catch (error) {
    analysis.issues.push(`URL解析错误: ${error.message}`)
    analysis.isValid = false
  }
  
  return analysis
}

// 4. 执行分析
const testURLs = generateTestURLs()
console.log(`📊 分析 ${testURLs.length} 个URL...\n`)

const results = testURLs.map(analyzeURL)

// 5. 生成报告
const validURLs = results.filter(r => r.isValid)
const invalidURLs = results.filter(r => !r.isValid)

console.log('📈 分析结果:')
console.log(`✅ 有效URL: ${validURLs.length}`)
console.log(`❌ 无效URL: ${invalidURLs.length}`)
console.log('')

// 6. 详细问题报告
if (invalidURLs.length > 0) {
  console.log('🚨 发现的URL问题:')
  console.log('')
  
  const issueGroups = {}
  invalidURLs.forEach(result => {
    result.issues.forEach(issue => {
      if (!issueGroups[issue]) {
        issueGroups[issue] = []
      }
      issueGroups[issue].push(result)
    })
  })
  
  Object.entries(issueGroups).forEach(([issue, results]) => {
    console.log(`📋 ${issue} (${results.length}个URL):`)
    results.slice(0, 5).forEach(result => {
      console.log(`   ${result.original}`)
      if (result.redirectTo) {
        console.log(`   → ${result.redirectTo}`)
      }
    })
    if (results.length > 5) {
      console.log(`   ... 还有 ${results.length - 5} 个类似URL`)
    }
    console.log('')
  })
}

// 7. 生成重定向映射
const redirectMap = {}
invalidURLs.forEach(result => {
  if (result.redirectTo) {
    redirectMap[result.original] = result.redirectTo
  }
})

if (Object.keys(redirectMap).length > 0) {
  console.log('🔄 建议的重定向映射:')
  Object.entries(redirectMap).slice(0, 10).forEach(([from, to]) => {
    console.log(`${from} → ${to}`)
  })
  if (Object.keys(redirectMap).length > 10) {
    console.log(`... 还有 ${Object.keys(redirectMap).length - 10} 个重定向`)
  }
  console.log('')
}

// 8. 检查sitemap一致性
console.log('📋 检查sitemap一致性...')
try {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
  
  const sitemapUrls = []
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g)
  if (urlMatches) {
    urlMatches.forEach(match => {
      const url = match.replace(/<\/?loc>/g, '')
      sitemapUrls.push(url)
    })
  }
  
  console.log(`✅ Sitemap包含 ${sitemapUrls.length} 个URL`)
  
  // 检查sitemap中的URL是否都是有效的
  const sitemapAnalysis = sitemapUrls.map(analyzeURL)
  const invalidSitemapUrls = sitemapAnalysis.filter(r => !r.isValid)
  
  if (invalidSitemapUrls.length > 0) {
    console.log(`❌ Sitemap中发现 ${invalidSitemapUrls.length} 个无效URL`)
  } else {
    console.log('✅ Sitemap中所有URL都是有效的')
  }
  
} catch (error) {
  console.log('❌ 无法读取sitemap.xml:', error.message)
}

// 9. 总结和建议
console.log('\n' + '='.repeat(60))
console.log('📊 URL验证总结:')
console.log('')

if (invalidURLs.length === 0) {
  console.log('🎉 所有URL都符合标准！')
} else {
  console.log('💡 建议的修复措施:')
  console.log('1. 在入口层统一移除lng查询参数（推荐middleware）')
  console.log('2. 仅保留路径前缀作为多语言URL规范')
  console.log('3. 在robots.txt中禁止问题URL格式')
  console.log('4. 监控Google Search Console的"备用网页"状态')
}

console.log('')
console.log('🔧 相关文件:')
console.log('- src/middleware.ts (入口层URL清理)')
console.log('- public/robots.txt (搜索引擎指令)')
console.log('- src/lib/urlUtils.ts (canonical/hreflang生成)')

// 注意：URL验证发现问题是正常的，因为我们故意测试了问题URL
// 这些问题将通过middleware和重定向规则自动修复
console.log('')
console.log('ℹ️  注意: 发现的URL问题是预期的，将通过以下机制自动修复:')
console.log('   • middleware 在入口层移除lng参数')
console.log('   • canonical/hreflang仅输出路径前缀URL')
console.log('   • robots.txt 阻止索引问题URL')

// 不要因为发现预期的URL问题而失败构建
process.exit(0)

