#!/usr/bin/env node

/**
 * 配置一致性验证脚本
 * 确保所有配置文件使用统一的语言配置
 */

const fs = require('fs')
const path = require('path')

// 从主配置文件读取支持的语言列表
// 注意：这里我们直接定义以避免TS编译问题，但在实际项目中应该从编译后的文件读取
const EXPECTED_LOCALES = [
  'en', 'zh-CN', 'id', 'pt', 'tl', 'ms', 'hi', 'vi', 'kk', 'ru'
]

console.log('🔍 开始验证配置一致性...\n')

// 验证函数
const validateConfig = () => {
  let hasErrors = false

  // 1. 验证 next-i18next.config.js
  console.log('📋 检查 next-i18next.config.js...')
  try {
    const configPath = path.join(process.cwd(), 'next-i18next.config.js')
    const configContent = fs.readFileSync(configPath, 'utf8')

    // 检查是否包含所有预期的语言
    const missingLocales = EXPECTED_LOCALES.filter(locale =>
      !configContent.includes(`'${locale}'`)
    )

    if (missingLocales.length === 0) {
      console.log('✅ next-i18next.config.js 包含所有预期语言')

      // 额外检查：确保配置注释存在，表明开发者知道需要保持同步
      if (configContent.includes('保持与 src/config/seo.ts 的一致性')) {
        console.log('✅ next-i18next.config.js 包含同步提醒注释')
      } else {
        console.log('⚠️  next-i18next.config.js 缺少同步提醒注释')
      }
    } else {
      console.log('❌ next-i18next.config.js 缺少语言:', missingLocales.join(', '))
      hasErrors = true
    }
  } catch (error) {
    console.log('❌ 无法读取 next-i18next.config.js:', error.message)
    hasErrors = true
  }

  // 2. 验证 sitemap 脚本
  console.log('📋 检查 scripts/generate-sitemap.js...')
  try {
    const sitemapPath = path.join(process.cwd(), 'scripts/generate-sitemap.js')
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
    
    // 检查是否包含所有预期的语言
    const missingLocales = EXPECTED_LOCALES.filter(locale => 
      !sitemapContent.includes(`'${locale}'`)
    )
    
    if (missingLocales.length === 0) {
      console.log('✅ sitemap 脚本包含所有预期语言')
    } else {
      console.log('❌ sitemap 脚本缺少语言:', missingLocales.join(', '))
      hasErrors = true
    }
  } catch (error) {
    console.log('❌ 无法读取 sitemap 脚本:', error.message)
    hasErrors = true
  }

  // 3. 验证 robots.txt
  console.log('📋 检查 public/robots.txt...')
  try {
    const robotsPath = path.join(process.cwd(), 'public/robots.txt')
    const robotsContent = fs.readFileSync(robotsPath, 'utf8')
    
    // 检查是否允许所有正确的语言路径
    const allowedLocales = EXPECTED_LOCALES.filter(locale => 
      locale !== 'en' && robotsContent.includes(`Allow: /${locale}`)
    )
    
    if (allowedLocales.length === EXPECTED_LOCALES.length - 1) { // -1 因为en是默认语言
      console.log('✅ robots.txt 允许所有语言路径')
    } else {
      console.log('❌ robots.txt 可能缺少某些语言路径')
      hasErrors = true
    }
    
    // 检查是否禁止了错误的语言代码
    if (robotsContent.includes('Disallow: /fil')) {
      console.log('✅ robots.txt 正确禁止了遗留语言代码 /fil')
    } else {
      console.log('⚠️  robots.txt 未禁止遗留语言代码 /fil')
    }
  } catch (error) {
    console.log('❌ 无法读取 robots.txt:', error.message)
    hasErrors = true
  }

  // 4. 验证 TypeScript 配置文件是否存在
  console.log('📋 检查 src/config/seo.ts...')
  try {
    const seoConfigPath = path.join(process.cwd(), 'src/config/seo.ts')
    if (fs.existsSync(seoConfigPath)) {
      console.log('✅ 统一SEO配置文件存在')
    } else {
      console.log('❌ 统一SEO配置文件不存在')
      hasErrors = true
    }
  } catch (error) {
    console.log('❌ 检查SEO配置文件时出错:', error.message)
    hasErrors = true
  }

  return !hasErrors
}

// 运行验证
const isValid = validateConfig()

console.log('\n' + '='.repeat(50))
if (isValid) {
  console.log('🎉 所有配置验证通过！')
  process.exit(0)
} else {
  console.log('💥 配置验证失败，请检查上述错误')
  process.exit(1)
}
