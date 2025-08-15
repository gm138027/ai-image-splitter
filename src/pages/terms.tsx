import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ArrowLeft, Scale, FileText, Users, Shield, AlertTriangle, Globe, Settings, Phone } from 'lucide-react'
import Layout from '@/components/Layout'
import SEOHead from '@/components/SEO/SEOHead'

const TermsOfService: NextPage = () => {
  const { t } = useTranslation(['terms', 'common'])
  const router = useRouter()

  // Table of contents navigation items
  const tableOfContents = [
    { id: 'agreement', title: t('terms:sections.agreement.title'), icon: Scale },
    { id: 'serviceDescription', title: t('terms:sections.serviceDescription.title'), icon: FileText },
    { id: 'userResponsibilities', title: t('terms:sections.userResponsibilities.title'), icon: Users },
    { id: 'intellectualProperty', title: t('terms:sections.intellectualProperty.title'), icon: Shield },
    { id: 'prohibited', title: t('terms:sections.prohibited.title'), icon: AlertTriangle },
    { id: 'privacy', title: t('terms:sections.privacy.title'), icon: Shield },
    { id: 'serviceAvailability', title: t('terms:sections.serviceAvailability.title'), icon: Globe },
    { id: 'disclaimers', title: t('terms:sections.disclaimers.title'), icon: AlertTriangle },
    { id: 'limitation', title: t('terms:sections.limitation.title'), icon: Scale },
    { id: 'termination', title: t('terms:sections.termination.title'), icon: Settings },
    { id: 'modifications', title: t('terms:sections.modifications.title'), icon: FileText },
    { id: 'governingLaw', title: t('terms:sections.governingLaw.title'), icon: Scale },
    { id: 'contact', title: t('terms:sections.contact.title'), icon: Phone }
  ]

  // Scroll to specified section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Use unified SEO component */}
      <SEOHead
        title={`${t('terms:title')} - AI Image Splitter`}
        description={t('terms:description')}
        keywords="terms of service, user agreement, AI image splitter"
      />

      <Head>
        {/* Additional page-specific meta tags - basic SEO handled by SEOHead */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://aiimagesplitter.com/terms" />
        <meta property="og:site_name" content="AI Image Splitter" />
        <meta property="og:locale" content={router.locale === 'zh-CN' ? 'zh_CN' : 'en_US'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${t('terms:title')} - AI Image Splitter`} />
        <meta name="twitter:description" content={t('terms:description')} />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": t('terms:title'),
              "description": t('terms:description'),
              "url": "https://aiimagesplitter.com/terms",
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
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back to home link */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('terms:navigation.backToHome')}
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Table of contents navigation - Fixed on desktop, collapsible on mobile */}
              <div className="lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      {t('terms:navigation.tableOfContents')}
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

              {/* Main content */}
              <div className="flex-1 max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                    <div className="flex items-center mb-4">
                      <Scale className="mr-4 h-8 w-8" />
                      <h1 className="text-3xl font-bold">{t('terms:title')}</h1>
                    </div>
                    <p className="text-blue-100 text-lg mb-4">{t('terms:description')}</p>
                    <p className="text-blue-200 text-sm">{t('terms:lastUpdated')}</p>
                  </div>

                  {/* Content area */}
                  <div className="px-8 py-8 space-y-12">

                    {/* Terms agreement */}
                    <section id="agreement">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Scale className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.agreement.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('terms:sections.agreement.content')}
                      </p>
                    </section>

                    {/* Service description */}
                    <section id="serviceDescription">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.serviceDescription.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('terms:sections.serviceDescription.content')}
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                          {t('terms:sections.serviceDescription.features_title')}
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-blue-700">
                          {(t('terms:sections.serviceDescription.features', { returnObjects: true }) as string[]).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* User responsibilities */}
                    <section id="userResponsibilities">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.userResponsibilities.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('terms:sections.userResponsibilities.content')}
                      </p>
                      
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('terms:sections.userResponsibilities.responsibilities', { returnObjects: true }) as string[]).map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Intellectual property */}
                    <section id="intellectualProperty">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Shield className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.intellectualProperty.title')}
                      </h2>
                      
                      {/* Your content */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-3">
                          {t('terms:sections.intellectualProperty.ownership.title')}
                        </h3>
                        <p className="text-green-700">
                          {t('terms:sections.intellectualProperty.ownership.content')}
                        </p>
                      </div>

                      {/* Service intellectual property */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                          {t('terms:sections.intellectualProperty.serviceIP.title')}
                        </h3>
                        <p className="text-yellow-700">
                          {t('terms:sections.intellectualProperty.serviceIP.content')}
                        </p>
                      </div>
                    </section>

                    {/* Prohibited use */}
                    <section id="prohibited">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="mr-3 h-6 w-6 text-red-600" />
                        {t('terms:sections.prohibited.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('terms:sections.prohibited.content')}
                      </p>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <ul className="list-disc list-inside space-y-2 text-red-700">
                          {(t('terms:sections.prohibited.items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* Privacy and data protection */}
                    <section id="privacy">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Shield className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.privacy.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('terms:sections.privacy.content')}
                      </p>
                    </section>

                    {/* Service availability */}
                    <section id="serviceAvailability">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Globe className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.serviceAvailability.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('terms:sections.serviceAvailability.content')}
                      </p>
                      
                      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                        {(t('terms:sections.serviceAvailability.reasons', { returnObjects: true }) as string[]).map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600 text-sm">
                          {t('terms:sections.serviceAvailability.disclaimer')}
                        </p>
                      </div>
                    </section>

                    {/* Disclaimers */}
                    <section id="disclaimers">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="mr-3 h-6 w-6 text-orange-600" />
                        {t('terms:sections.disclaimers.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {t('terms:sections.disclaimers.content')}
                      </p>
                      
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('terms:sections.disclaimers.items', { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Limitation of liability */}
                    <section id="limitation">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Scale className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.limitation.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('terms:sections.limitation.content')}
                      </p>
                    </section>

                    {/* Termination */}
                    <section id="termination">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Settings className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.termination.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('terms:sections.termination.content')}
                      </p>
                    </section>

                    {/* Terms modification */}
                    <section id="modifications">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.modifications.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('terms:sections.modifications.content')}
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-700 text-sm">
                          {t('terms:sections.modifications.notification')}
                        </p>
                      </div>
                    </section>

                    {/* Governing law */}
                    <section id="governingLaw">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Scale className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.governingLaw.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('terms:sections.governingLaw.content')}
                      </p>
                    </section>

                    {/* Contact information */}
                    <section id="contact">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Phone className="mr-3 h-6 w-6 text-blue-600" />
                        {t('terms:sections.contact.title')}
                      </h2>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-700 mb-4">
                          {t('terms:sections.contact.content')}
                        </p>
                        <p className="text-blue-600 font-semibold mb-2">
                          {t('terms:sections.contact.email')}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {t('terms:sections.contact.response')}
                        </p>
                      </div>
                    </section>

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

export default TermsOfService

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['terms', 'common'])),
    },
  }
}