import type { GetStaticProps, NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowLeft, Clock3, FileText, Info, Mail, MessageSquare, ClipboardList } from 'lucide-react'
import Layout from '@/components/Layout'
import SEOHead from '@/components/SEO/SEOHead'
import { SEO_CONFIG, SUPPORTED_LOCALES } from '@/config/seo'
import { usePageUrls } from '@/lib/urlUtils'

const ContactPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation(['contact', 'common'])
  const { currentUrl } = usePageUrls(router)
  const inlineLinkSpacer = router.locale === 'zh-CN' ? '' : ' '

  const tableOfContents = [
    { id: 'intro', title: t('contact:sections.intro.title'), icon: MessageSquare },
    { id: 'email', title: t('contact:sections.email.title'), icon: Mail },
    { id: 'topics', title: t('contact:sections.topics.title'), icon: ClipboardList },
    { id: 'responseTime', title: t('contact:sections.responseTime.title'), icon: Clock3 },
    { id: 'includeInfo', title: t('contact:sections.includeInfo.title'), icon: FileText },
    { id: 'additionalNote', title: t('contact:sections.additionalNote.title'), icon: Info }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <SEOHead
        title={`${t('contact:title')} - AI Image Splitter`}
        description={t('contact:description')}
        ogType="website"
        twitterCard="summary_large_image"
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: t('contact:title'),
              description: t('contact:description'),
              url: currentUrl,
              isPartOf: {
                '@type': 'WebSite',
                name: 'AI Image Splitter',
                url: SEO_CONFIG.domain
              },
              mainEntity: {
                '@type': 'Organization',
                name: 'AI Image Splitter',
                url: SEO_CONFIG.domain,
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  email: 'aiimagesplitter@proton.me',
                  availableLanguage: SUPPORTED_LOCALES
                }
              }
            })
          }}
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('contact:navigation.backToHome')}
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      {t('contact:navigation.tableOfContents')}
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

              <div className="flex-1 max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-12 text-white">
                    <div className="flex items-center mb-4">
                      <Mail className="mr-4 h-8 w-8" />
                      <h1 className="text-3xl font-bold">{t('contact:title')}</h1>
                    </div>
                    <p className="text-blue-100 text-lg">{t('contact:description')}</p>
                  </div>

                  <div className="px-8 py-8 space-y-12">
                    <section id="intro">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <MessageSquare className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.intro.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t('contact:sections.intro.content')}
                      </p>
                    </section>

                    <section id="email">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Mail className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.email.title')}
                      </h2>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          {t('contact:sections.email.label')}
                        </p>
                        <a
                          href="mailto:aiimagesplitter@proton.me"
                          className="text-lg font-semibold text-blue-700 hover:text-blue-900 break-all"
                        >
                          {t('contact:sections.email.value')}
                        </a>
                      </div>
                    </section>

                    <section id="topics">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <ClipboardList className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.topics.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('contact:sections.topics.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('contact:sections.topics.items', { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section id="responseTime">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Clock3 className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.responseTime.title')}
                      </h2>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                        <p className="text-emerald-800 leading-relaxed">
                          {t('contact:sections.responseTime.content')}
                        </p>
                      </div>
                    </section>

                    <section id="includeInfo">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.includeInfo.title')}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('contact:sections.includeInfo.content')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {(t('contact:sections.includeInfo.items', { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section id="additionalNote">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Info className="mr-3 h-6 w-6 text-blue-600" />
                        {t('contact:sections.additionalNote.title')}
                      </h2>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed">
                          {t('contact:sections.additionalNote.contentBeforePrivacyLink')}{inlineLinkSpacer}
                          <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                            {t('contact:sections.additionalNote.privacyLinkText')}
                          </Link>
                          {t('contact:sections.additionalNote.contentAfterPrivacyLink')}
                        </p>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                          {t('contact:sections.additionalNote.contentBeforeTermsLink')}{inlineLinkSpacer}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                            {t('contact:sections.additionalNote.termsLinkText')}
                          </Link>
                          {t('contact:sections.additionalNote.contentAfterTermsLink')}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'contact'])),
    },
  }
}

export default ContactPage
