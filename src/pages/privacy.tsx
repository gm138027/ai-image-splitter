import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ArrowLeft, Shield, Lock, Eye, Users, Globe, FileText, Mail } from 'lucide-react'
import Layout from '@/components/Layout'
import DomainLink from '@/components/UI/DomainLink'
import HreflangTags from '@/components/SEO/HreflangTags'
import LanguageSEO from '@/components/SEO/LanguageSEO'

const PrivacyPolicy: NextPage = () => {
  const { t } = useTranslation(['privacy', 'common'])
  const router = useRouter()

  // 目录导航项
  const tableOfContents = [
    { id: 'introduction', title: t('privacy:sections.introduction.title'), icon: Shield },
    { id: 'dataCollection', title: t('privacy:sections.dataCollection.title'), icon: Eye },
    { id: 'dataUsage', title: t('privacy:sections.dataUsage.title'), icon: Users },
    { id: 'dataSharing', title: t('privacy:sections.dataSharing.title'), icon: Globe },
    { id: 'dataSecurity', title: t('privacy:sections.dataSecurity.title'), icon: Lock },
    { id: 'cookies', title: t('privacy:sections.cookies.title'), icon: FileText },
    { id: 'userRights', title: t('privacy:sections.userRights.title'), icon: Users },
    { id: 'contact', title: t('privacy:sections.contact.title'), icon: Mail }
  ]

  // 滚动到指定部分
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Use LanguageSEO component to replace basic SEO tags */}
      <LanguageSEO 
        title={`${t('privacy:title')} - AI Image Splitter`}
        description={t('privacy:description')}
        keywords="privacy policy, data protection, AI image splitter"
      />
      
      <Head>
        {/* robots directive retained as LanguageSEO already includes more complete robots settings */}
        
        {/* Open Graph */}
        <meta property="og:title" content={`${t('privacy:title')} - AI Image Splitter`} />
        <meta property="og:description" content={t('privacy:description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://aiimagesplitter.com/privacy" />
        <meta property="og:site_name" content="AI Image Splitter" />
        <meta property="og:locale" content={router.locale === 'zh-CN' ? 'zh_CN' : 'en_US'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${t('privacy:title')} - AI Image Splitter`} />
        <meta name="twitter:description" content={t('privacy:description')} />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": t('privacy:title'),
              "description": t('privacy:description'),
              "url": "https://aiimagesplitter.com/privacy",
              "isPartOf": {
                "@type": "WebSite",
                "name": "AI Image Splitter",
                "url": "https://aiimagesplitter.com"
              },
              "lastReviewed": "2025-07-02T12:00:00Z",
              "reviewedBy": {
                "@type": "Organization",
                "name": "AI Image Splitter"
              }
            })
          }}
        />
      </Head>
      
      {/* hreflang和canonical标记 */}
      <HreflangTags />

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 返回链接 */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('privacy:navigation.backToHome')}
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* 目录导航 - 桌面端固定，移动端可收起 */}
              <div className="lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      {t('privacy:navigation.tableOfContents')}
                    </h3>
                    <nav className="space-y-2">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              {/* 主要内容 */}
              <div className="flex-1 max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* 页眉 */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                    <div className="flex items-center mb-4">
                      <Shield className="mr-4 h-8 w-8" />
                      <h1 className="text-3xl font-bold">{t('privacy:title')}</h1>
                    </div>
                    <p className="text-blue-100 text-lg mb-4">{t('privacy:description')}</p>
                    <p className="text-blue-200 text-sm">{t('privacy:lastUpdated')}</p>
                  </div>

                  {/* 内容区域 */}
                  <div className="px-8 py-8 space-y-12">

                    {/* 简介 */}
                    <section id="introduction">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Shield className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.introduction.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('privacy:sections.introduction.content')}
                      </p>
                    </section>

                    {/* 我们收集的信息 */}
                    <section id="dataCollection">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Eye className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.dataCollection.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('privacy:sections.dataCollection.overview')}
                      </p>

                      {/* 图像处理 */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-3">
                          {t('privacy:sections.dataCollection.subsections.imageProcessing.title')}
                        </h3>
                        <p className="text-green-700">
                          {t('privacy:sections.dataCollection.subsections.imageProcessing.content')}
                        </p>
                      </div>

                      {/* 技术数据 */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {t('privacy:sections.dataCollection.subsections.technicalData.title')}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {t('privacy:sections.dataCollection.subsections.technicalData.content')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {(t('privacy:sections.dataCollection.subsections.technicalData.items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 不收集个人信息 */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                          {t('privacy:sections.dataCollection.subsections.noPersonalData.title')}
                        </h3>
                        <p className="text-blue-700 mb-4">
                          {t('privacy:sections.dataCollection.subsections.noPersonalData.content')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-blue-600">
                          {(t('privacy:sections.dataCollection.subsections.noPersonalData.items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* 信息使用方式 */}
                    <section id="dataUsage">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.dataUsage.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('privacy:sections.dataUsage.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('privacy:sections.dataUsage.items', { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    {/* 信息共享 */}
                    <section id="dataSharing">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Globe className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.dataSharing.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('privacy:sections.dataSharing.content')}
                      </p>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                          {t('privacy:sections.dataSharing.thirdPartyServices.googleAnalytics.title')}
                        </h3>
                        <p className="text-yellow-700">
                          {t('privacy:sections.dataSharing.thirdPartyServices.googleAnalytics.content')}
                        </p>
                      </div>
                    </section>

                    {/* 数据安全 */}
                    <section id="dataSecurity">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Lock className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.dataSecurity.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('privacy:sections.dataSecurity.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('privacy:sections.dataSecurity.measures', { returnObjects: true }) as string[]).map((measure, index) => (
                          <li key={index}>{measure}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Cookie和本地存储 */}
                    <section id="cookies">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.cookies.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('privacy:sections.cookies.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                        {(t('privacy:sections.cookies.items', { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                        <p className="text-amber-700">
                          <strong>{t('privacy:sections.cookies.note_label')}</strong> {t('privacy:sections.cookies.note')}
                        </p>
                      </div>
                    </section>

                    {/* 您的权利 */}
                    <section id="userRights">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.userRights.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('privacy:sections.userRights.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('privacy:sections.userRights.rights', { returnObjects: true }) as string[]).map((right, index) => (
                          <li key={index}>{right}</li>
                        ))}
                      </ul>
                    </section>

                    {/* 儿童隐私保护 */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('privacy:sections.minorProtection.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('privacy:sections.minorProtection.content')}
                      </p>
                    </section>

                    {/* 国际用户 */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('privacy:sections.internationalUsers.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('privacy:sections.internationalUsers.content')}
                      </p>
                    </section>

                    {/* 隐私政策变更 */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('privacy:sections.policyChanges.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('privacy:sections.policyChanges.content')}
                      </p>
                    </section>

                    {/* 联系我们 */}
                    <section id="contact" className="bg-gray-50 rounded-lg p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Mail className="mr-3 h-6 w-6 text-blue-600" />
                        {t('privacy:sections.contact.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('privacy:sections.contact.content')}
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-blue-600 font-medium mb-2">
                          {t('privacy:sections.contact.email')}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {t('privacy:sections.contact.response')}
                        </p>
                      </div>
                    </section>

                    {/* 回到顶部链接 */}
                    <div className="text-center pt-8 border-t border-gray-200">
                      <DomainLink className="text-blue-600 hover:text-blue-800 font-medium" />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'privacy'])),
    },
  }
}

export default PrivacyPolicy 