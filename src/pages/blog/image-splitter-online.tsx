import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import SEOHead from '@/components/SEO/SEOHead'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import SEO_CONFIG from '@/config/seo'

interface ScenarioItem {
  title: string
  description: string
}

interface CaseItem {
  id: string
  label: string
  heading: string
  description: string
  steps: string[]
  image: string
  imageAlt: string
}

interface FeatureItem {
  title: string
  description: string
}

interface FAQItem {
  question: string
  answer: string
}

interface CTAAction {
  label: string
  href: string
}

const IGRID_URL = 'igridmaker.com'

const ImageSplitterOnlinePage: NextPage = () => {
  const { t } = useTranslation(['common', 'blog', 'blog-image-splitter'])

  const scenarios = t('blog-image-splitter:scenarios.items', { returnObjects: true }) as ScenarioItem[]
  const cases = t('blog-image-splitter:cases.items', { returnObjects: true }) as CaseItem[]
  const features = t('blog-image-splitter:features.items', { returnObjects: true }) as FeatureItem[]
  const faqs = t('blog-image-splitter:faq.items', { returnObjects: true }) as FAQItem[]
  const introCTA = t('blog-image-splitter:intro.cta', { returnObjects: true }) as CTAAction

  const pageUrl = `${SEO_CONFIG.domain}/blog/image-splitter-online`
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: t('blog-image-splitter:hero.title'),
    description: t('blog-image-splitter:seo.description'),
    image: `${SEO_CONFIG.domain}${t('blog-image-splitter:hero.coverImage')}`,
    author: {
      '@type': 'Organization',
      name: 'AI Image Splitter'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Image Splitter',
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.domain}/android-chrome-512x512.png`
      }
    },
    datePublished: '2025-12-20T00:00:00Z',
    dateModified: '2025-12-20T00:00:00Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    keywords: t('blog-image-splitter:seo.keywords')
  }

  const renderTextWithLink = (text: string) => {
    if (!text?.includes(IGRID_URL)) {
      return text
    }

    const segments = text.split(IGRID_URL)

    return segments.map((segment, index) => (
      <React.Fragment key={`${segment}-${index}`}>
        {segment}
        {index < segments.length - 1 && (
          <Link
            href="https://igridmaker.com"
            target="_blank"
            rel="noopener"
            className="text-primary-600 underline font-medium"
          >
            {IGRID_URL}
          </Link>
        )}
      </React.Fragment>
    ))
  }

  return (
    <>
      <SEOHead
        ogType="article"
        ogImagePath={t('blog-image-splitter:hero.coverImage')}
        title={`${t('blog-image-splitter:seo.title')} - AI Image Splitter`}
        description={t('blog-image-splitter:seo.description')}
        keywords={t('blog-image-splitter:seo.keywords')}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
        />
      </Head>

      <Layout>
        <article className="bg-gradient-to-b from-gray-50 via-white to-primary-50/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('blog:backToHome')}
              </Link>
            </div>

            <header className="text-center mb-10">
              <p className="uppercase text-sm tracking-widest text-primary-600 mb-3">
                {t('blog-image-splitter:hero.eyebrow')}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('blog-image-splitter:hero.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('blog-image-splitter:hero.subtitle')}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-6">
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('blog-image-splitter:hero.meta.readingTime')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('blog-image-splitter:hero.meta.updated')}
                </span>
              </div>
              <div className="relative w-full h-72 lg:h-[420px] mt-10 rounded-3xl overflow-hidden shadow-modern-lg border border-white/20">
                <Image
                  src={t('blog-image-splitter:hero.coverImage')}
                  alt={t('blog-image-splitter:hero.coverAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority={false}
                />
              </div>
            </header>

            <section className="mb-12 bg-white/90 border border-white/60 shadow-modern-lg rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('blog-image-splitter:intro.title')}
              </h2>
              {(t('blog-image-splitter:intro.paragraphs', { returnObjects: true }) as string[]).map(
                (paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              )}
              {introCTA?.label && (
                <div className="mt-6">
                  <Link
                    href={introCTA.href || '/'}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold shadow hover:bg-primary-700"
                  >
                    {introCTA.label}
                  </Link>
                </div>
              )}
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {t('blog-image-splitter:scenarios.title')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {scenarios.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/90 border border-white/60 shadow-lg rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {t('blog-image-splitter:cases.title')}
              </h2>
              <div className="space-y-10">
                {cases.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 border border-white/60 shadow-modern-lg rounded-3xl p-6 lg:p-10"
                  >
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                      <div>
                        <p className="text-primary-600 font-semibold uppercase tracking-widest text-xs mb-2">
                          {item.label}
                        </p>
                        <h3 className="text-2xl font-semibold mb-3">{item.heading}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                          {item.steps.map((step, idx) => (
                            <li key={idx}>{renderTextWithLink(step)}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-white/40">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {t('blog-image-splitter:features.title')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white/90 border border-white/60 rounded-2xl p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {t('blog-image-splitter:faq.title')}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="bg-white/90 border border-white/60 rounded-2xl p-5 shadow"
                  >
                    <summary className="font-semibold cursor-pointer text-lg">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-gray-600">{renderTextWithLink(faq.answer)}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-3xl p-8 shadow-modern-lg">
              <h2 className="text-2xl font-bold mb-3">
                {t('blog-image-splitter:cta.title')}
              </h2>
              <p className="mb-6 text-white/90">
                {t('blog-image-splitter:cta.description')}
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100"
              >
                {t('blog-image-splitter:cta.button')}
              </Link>
            </section>
          </div>
        </article>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'blog', 'blog-image-splitter']))
    }
  }
}

export default ImageSplitterOnlinePage
