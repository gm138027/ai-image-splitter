import type { NextPage, GetServerSideProps } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import ImageSplitter from '@/components/ImageSplitter'
import StructuredData from '@/components/SEO/StructuredData'
import HreflangTags from '@/components/SEO/HreflangTags'
import LanguageSEO from '@/components/SEO/LanguageSEO'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [resetKey, setResetKey] = useState(0)
  const [isInToolMode, setIsInToolMode] = useState(false)

  const handleLogoClick = () => {
    // Force re-render of ImageSplitter component by changing key to reset state
    setResetKey(prev => prev + 1)
    // Reset tool mode state
    setIsInToolMode(false)
  }

  const handleToolModeChange = (inToolMode: boolean) => {
    setIsInToolMode(inToolMode)
  }

  return (
    <>
      {/* Use new LanguageSEO component to replace original basic SEO tags */}
      <LanguageSEO />
      
      <Head>
        
        {/* Critical LCP image preload - key configuration to prevent layout shifts */}
        <link
          rel="preload"
          as="image"
          href="/images/penguin-split.png"
          type="image/png"
          imageSizes="192px"
          imageSrcSet="/images/penguin-split.png"
        />
        
        {/* Website icon configuration - solve browser tab display issue */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Add more logo-related meta tags */}
        <meta name="msapplication-TileImage" content="/android-chrome-512x512.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Remove duplicate Open Graph and Twitter metadata - handled by LanguageSEO */}
        
        {/* Basic viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      
      {/* hreflang and canonical tags - solve multilingual website alternate page issue */}
      <HreflangTags />
      
      {/* Structured data */}
      <StructuredData locale={router.locale} />
      
      <Layout onLogoClick={handleLogoClick} isInToolMode={isInToolMode}>
        <ImageSplitter key={resetKey} onToolModeChange={handleToolModeChange} />
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default Home 