import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

interface DomainLinkProps {
  className?: string
  showProtocol?: boolean
}

/**
 * Domain link component - SEO optimized internal link
 * 
 * 作用：
 * 1. 将域名作为锚文本链接到首页
 * 2. 传递链接权重，提升首页SEO
 * 3. 增强用户体验和品牌记忆
 * 4. 改善网站内链结构
 */
const DomainLink: React.FC<DomainLinkProps> = ({ 
  className = "text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 underline decoration-2 underline-offset-2", 
  showProtocol = false 
}) => {
  const { t } = useTranslation('common')
  
  const domainText = showProtocol ? 'https://aiimagesplitter.com' : 'aiimagesplitter.com'
  
  return (
    <Link 
      href="/"
      className={className}
      title={t('nav.backToHome') || '返回首页'}
      aria-label={`${t('nav.backToHome')} - AI Image Splitter`}
    >
      {domainText}
    </Link>
  )
}

export default DomainLink 