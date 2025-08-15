import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import DomainLink from '@/components/UI/DomainLink'
import SEOHead from '@/components/SEO/SEOHead'

// Function to parse {domainLink} placeholders in translation text
const parseTextWithDomainLink = (text: string): React.ReactNode => {
  if (!text.includes('{domainLink}')) {
    return text
  }
  
  const parts = text.split('{domainLink}')
  return (
    <>
      {parts[0]}
      <DomainLink />
      {parts[1]}
    </>
  )
}

const CompleteGuide: NextPage = () => {
  const { t } = useTranslation(['common', 'blog'])
  const router = useRouter()

  return (
    <>
      {/* Use unified SEO component */}
      <SEOHead
        title={`${t('blog:posts.complete-guide.title')} - AI Image Splitter`}
        description={t('blog:posts.complete-guide.description')}
        keywords={t('blog:posts.complete-guide.keywords')}
      />
      
      <Head>
        
        {/* Open Graph */}
        <meta property="og:title" content={`${t('blog:posts.complete-guide.title')} - AI Image Splitter`} />
        <meta property="og:description" content={t('blog:posts.complete-guide.description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://aiimagesplitter.com/blog/complete-guide" />
        <meta property="og:image" content="https://aiimagesplitter.com/images/blog/complete-guide-cover.jpg" />
        <meta property="og:site_name" content="AI Image Splitter" />
        <meta property="og:locale" content={router.locale === 'zh-CN' ? 'zh_CN' : 'en_US'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('blog:posts.complete-guide.title')} - AI Image Splitter`} />
        <meta name="twitter:description" content={t('blog:posts.complete-guide.description')} />
        <meta name="twitter:image" content="https://aiimagesplitter.com/images/blog/complete-guide-cover.jpg" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": t('blog:posts.complete-guide.title'),
              "description": t('blog:posts.complete-guide.description'),
              "image": "https://aiimagesplitter.com/images/blog/complete-guide-cover.jpg",
              "author": {
                "@type": "Organization",
                "name": "AI Image Splitter"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AI Image Splitter",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://aiimagesplitter.com/android-chrome-512x512.png"
                }
              },
              "datePublished": "2025-06-27T00:00:00Z",
              "dateModified": "2025-07-02T00:00:00Z",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://aiimagesplitter.com/blog/complete-guide"
              },
              "keywords": t('blog:posts.complete-guide.keywords')
            })
          }}
        />
      </Head>
      
      <Layout>
        <article className="min-h-screen bg-white">
          {/* 文章头部 */}
          <header className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {t('blog:posts.complete-guide.category')}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('blog:posts.complete-guide.title')}
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  {t('blog:posts.complete-guide.description')}
                </p>
                
                <div className="flex items-center justify-center gap-6 text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{t('blog:publishedOn')} 2025-06-27</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{t('blog:posts.complete-guide.readingTime')}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 文章内容 */}
          <div className="container mx-auto px-4 max-w-4xl py-16">
            {/* 返回博客链接 */}
            <div className="mb-8">
              <Link 
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('blog:backToHome')}
              </Link>
            </div>

            {/* 引言 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('blog:posts.complete-guide.intro.title')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('blog:posts.complete-guide.intro.content')}
              </p>
            </section>

            {/* 封面图片 */}
            <div className="mb-12">
              <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/blog/complete-guide-cover.jpg"
                  alt={t('blog:imageAlt.guideComplete')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority={false}
                  quality={85}
                />
              </div>
            </div>

            {/* 操作步骤 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('blog:posts.complete-guide.stepByStep.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('blog:posts.complete-guide.stepByStep.subtitle')}
              </p>

              {/* 步骤列表 */}
              <div className="space-y-8">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                  <div key={stepNum} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t(`blog:posts.complete-guide.stepByStep.step${stepNum}.title`)}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {stepNum === 1 ? 
                        parseTextWithDomainLink(t(`blog:posts.complete-guide.stepByStep.step${stepNum}.content`)) :
                        t(`blog:posts.complete-guide.stepByStep.step${stepNum}.content`)
                      }
                    </p>
                    
                    {/* 步骤1的方法 */}
                    {stepNum === 1 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step1.method1')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step1.method2')}</p>
                      </div>
                    )}
                    
                    {/* 步骤2的模式 */}
                    {stepNum === 2 && (
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.vertical.name')}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.vertical.description')}
                          </p>
                          <p className="text-xs text-green-600">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.vertical.useCase')}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.horizontal.name')}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.horizontal.description')}
                          </p>
                          <p className="text-xs text-green-600">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.horizontal.useCase')}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.grid.name')}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.grid.description')}
                          </p>
                          <p className="text-xs text-green-600">
                            {t('blog:posts.complete-guide.stepByStep.step2.modes.grid.useCase')}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 步骤3的设置 */}
                    {stepNum === 3 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step3.setting1')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step3.setting2')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step3.setting3')}</p>
                        <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded">
                          {t('blog:posts.complete-guide.stepByStep.step3.preview')}
                        </p>
                      </div>
                    )}
                    
                    {/* 步骤4的技巧 */}
                    {stepNum === 4 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step4.tip1')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step4.tip2')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step4.tip3')}</p>
                      </div>
                    )}
                    
                    {/* 步骤5的格式 */}
                    {stepNum === 5 && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded border">
                          <span className="font-semibold">JPG:</span> {t('blog:posts.complete-guide.stepByStep.step5.formats.jpg')}
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <span className="font-semibold">PNG:</span> {t('blog:posts.complete-guide.stepByStep.step5.formats.png')}
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <span className="font-semibold">WebP:</span> {t('blog:posts.complete-guide.stepByStep.step5.formats.webp')}
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <span className="font-semibold">BMP:</span> {t('blog:posts.complete-guide.stepByStep.step5.formats.bmp')}
                        </div>
                      </div>
                    )}
                    
                    {/* 步骤6的下载选项 */}
                    {stepNum === 6 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step6.option1')}</p>
                        <p className="text-gray-700">{t('blog:posts.complete-guide.stepByStep.step6.option2')}</p>
                      </div>
                    )}
                    
                    {/* 添加注意事项 */}
                    {stepNum === 1 && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold">{t('blog:tipLabel')}</span> {t('blog:posts.complete-guide.stepByStep.step1.note')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 专业使用技巧 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('blog:posts.complete-guide.bestPractices.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('blog:posts.complete-guide.bestPractices.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((tipNum) => (
                  <div key={tipNum} className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-3">
                      {t(`blog:posts.complete-guide.bestPractices.tip${tipNum}.title`)}
                    </h3>
                    <p className="text-gray-700">
                      {t(`blog:posts.complete-guide.bestPractices.tip${tipNum}.content`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 常见问题 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('blog:posts.complete-guide.faq.title')}
              </h2>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((qNum) => (
                  <div key={qNum} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-3">
                      {t(`blog:posts.complete-guide.faq.q${qNum}.question`)}
                    </h3>
                    <p className="text-gray-700">
                      {t(`blog:posts.complete-guide.faq.q${qNum}.answer`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 结论和行动号召 */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('blog:posts.complete-guide.conclusion.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('blog:posts.complete-guide.conclusion.content')}
              </p>
              
              <Link 
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('blog:startUsingTool')}
                <ExternalLink className="w-5 h-5 ml-2" />
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
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'blog'])),
    },
  }
}

export default CompleteGuide 