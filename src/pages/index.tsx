import type { NextPage, GetStaticProps } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import ImageSplitter from '@/components/ImageSplitter'
import StructuredData from '@/components/SEO/StructuredData'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [resetKey, setResetKey] = useState(0)
  const [isInToolMode, setIsInToolMode] = useState(false)

  const handleLogoClick = () => {
    // 通过改变key来强制重新渲染ImageSplitter组件，从而重置状态
    setResetKey(prev => prev + 1)
    // 重置工具模式状态
    setIsInToolMode(false)
  }

  const handleToolModeChange = (inToolMode: boolean) => {
    setIsInToolMode(inToolMode)
  }

  return (
    <>
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        
        {/* 网站图标配置 - 解决浏览器标签页显示问题 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* 添加更多logo相关的meta标签 */}
        <meta name="msapplication-TileImage" content="/android-chrome-512x512.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Open Graph 元数据 */}
        <meta property="og:title" content={t('seo.title')} />
        <meta property="og:description" content={t('seo.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiimagesplitter.com" />
        <meta property="og:site_name" content="AI Image Splitter" />
        <meta property="og:image" content="https://aiimagesplitter.com/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:locale" content={router.locale === 'zh-CN' ? 'zh_CN' : 'en_US'} />
        
        {/* Twitter Card 元数据 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.title')} />
        <meta name="twitter:description" content={t('seo.description')} />
        <meta name="twitter:image" content="https://aiimagesplitter.com/android-chrome-512x512.png" />
        <meta name="twitter:site" content="@aiimagesplitter" />
        
        {/* 搜索引擎优化 */}
        <link rel="canonical" href="https://aiimagesplitter.com" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* 预加载重要图片 */}
        <link rel="preload" href="/images/penguin-original.png" as="image" />
        <link rel="preload" href="/images/penguin-split.png" as="image" />
      </Head>
      
      {/* 结构化数据 */}
      <StructuredData locale={router.locale} />
      
      <Layout onLogoClick={handleLogoClick} isInToolMode={isInToolMode}>
        <ImageSplitter key={resetKey} onToolModeChange={handleToolModeChange} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default Home 