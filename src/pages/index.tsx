import type { NextPage, GetStaticProps } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import ImageSplitter from '@/components/ImageSplitter'
import SEOHead from '@/components/SEO/SEOHead'
import FAQStructuredData from '@/components/SEO/FAQStructuredData'

const Home: NextPage = () => {
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
      {/* Unified SEO component with structured data for homepage */}
      <SEOHead includeStructuredData={true} />

      {/* FAQ structured data - only for homepage */}
      <FAQStructuredData />

      <Head>
        
        {/* Critical LCP image preload - key configuration to prevent layout shifts */}
        <link
          rel="preload"
          as="image"
          href="/images/penguin-split.png"
          type="image/png"
          imagesizes="192px"
          imagesrcset="/images/penguin-split.png"
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
        
        {/* Remove duplicate Open Graph and Twitter metadata - handled by SEOHead */}

      </Head>
      
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
