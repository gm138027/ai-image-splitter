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
    
    // 遗留语言代码
    urls.push(`${BASE_URL}/fil${path}`)
    
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
      analysis.issues.push('使用查询参数格式的语言切换')
      analysis.isValid = false
      
      const normalizedLocale = lngParam === 'fil' ? 'tl' : lngParam
      if (normalizedLocale === DEFAULT_LOCALE) {
        analysis.redirectTo = `${BASE_URL}${pathname}`
      } else {
        analysis.redirectTo = `${BASE_URL}/${normalizedLocale}${pathname}`
      }
    }
    
    // 检查路径
    const pathSegments = pathname.split('/').filter(Boolean)
    let locale = DEFAULT_LOCALE
    let contentPath = pathname
    
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0]
      
      if (firstSegment === 'fil') {
        analysis.issues.push('使用遗留语言代码 "fil"')
        analysis.isValid = false
        analysis.redirectTo = `${BASE_URL}/tl${pathname.substring(4)}`
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
  console.log('1. 部署middleware.ts处理URL重定向')
  console.log('2. 更新next.config.js添加重定向规则')
  console.log('3. 在robots.txt中禁止问题URL格式')
  console.log('4. 监控Google Search Console的"备用网页"状态')
}

console.log('')
console.log('🔧 相关文件:')
console.log('- src/middleware.ts (URL重定向处理)')
console.log('- next.config.js (重定向规则)')
console.log('- public/robots.txt (搜索引擎指令)')
console.log('- src/utils/urlCleaner.ts (URL清理工具)')

// 注意：URL验证发现问题是正常的，因为我们故意测试了问题URL
// 这些问题将通过middleware和重定向规则自动修复
console.log('')
console.log('ℹ️  注意: 发现的URL问题是预期的，将通过以下机制自动修复:')
console.log('   • middleware.ts 自动重定向')
console.log('   • next.config.js 重定向规则')
console.log('   • robots.txt 阻止索引问题URL')

// 不要因为发现预期的URL问题而失败构建
process.exit(0)

