import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import HreflangTags from '@/components/SEO/HreflangTags'
import LanguageSEO from '@/components/SEO/LanguageSEO'

interface BlogPost {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  href: string;
}

const BlogIndex: NextPage = () => {
  const { t } = useTranslation(['common', 'blog'])
  const router = useRouter()

  const posts: BlogPost[] = [
    {
      id: 'complete-guide',
      title: t('blog:posts.complete-guide.title'),
      description: t('blog:posts.complete-guide.description'),
      publishedAt: '2025-06-25',
      readingTime: t('blog:posts.complete-guide.readingTime'),
      category: t('blog:posts.complete-guide.category'),
      href: '/blog/complete-guide'
    }
  ]

  return (
    <>
      {/* Use LanguageSEO component to replace basic SEO tags */}
      <LanguageSEO 
        title={`${t('blog:title')} - AI Image Splitter`}
        description={t('blog:description')}
        keywords="AI image splitter blog, tutorials, tips, Instagram grid, social media"
      />
      
      <Head>
        
        {/* Open Graph */}
        <meta property="og:title" content={`${t('blog:title')} - AI Image Splitter`} />
        <meta property="og:description" content={t('blog:description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiimagesplitter.com/blog" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('blog:title')} - AI Image Splitter`} />
        <meta name="twitter:description" content={t('blog:description')} />
      </Head>
      
      {/* hreflang和canonical标记 */}
      <HreflangTags />

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 页面头部 */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {t('blog:title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('blog:description')}
              </p>
            </div>

            {/* 博客文章列表 */}
            <div className="grid gap-8 md:gap-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern-lg border border-white/20 overflow-hidden hover:shadow-purple-lg transition-all duration-500 group"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* 文章图片 */}
                    <div className="lg:w-2/5">
                      <div className="h-64 lg:h-full relative overflow-hidden">
                        <Image
                          src="/images/blog/complete-guide-thumb.jpg"
                          alt={t('blog:imageAlt.guideComplete')}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* 文章内容 */}
                    <div className="lg:w-3/5 p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-gradient-blue text-white text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readingTime}
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {t('blog:publishedOn')} {new Date(post.publishedAt).toLocaleDateString(router.locale)}
                        </div>

                        <Link 
                          href={post.href}
                          className="inline-flex items-center gap-2 bg-gradient-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors group"
                        >
                          {t('blog:readMore')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 返回首页链接 */}
            <div className="text-center mt-16">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                ← {t('blog:backToHome')}
              </Link>
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
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'blog'])),
    },
  }
}

export default BlogIndex 