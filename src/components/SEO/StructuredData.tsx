import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

interface StructuredDataProps {
  locale?: string
}

const StructuredData: React.FC<StructuredDataProps> = ({ locale = 'zh-CN' }) => {
  const router = useRouter()
  const currentUrl = `https://aiimagesplitter.com${router.asPath}`
  const { t } = useTranslation('common')
  
  // 组织结构化数据 - 这是Google显示logo的关键
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://aiimagesplitter.com/#organization",
    "name": "AI Image Splitter",
    "alternateName": "AI图像分割器",
    "url": "https://aiimagesplitter.com",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://aiimagesplitter.com/#logo",
      "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "contentUrl": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "width": 512,
      "height": 512,
      "caption": "AI Image Splitter Logo",
      "inLanguage": locale === 'zh-CN' ? "zh-CN" : "en-US"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://aiimagesplitter.com"
    ],
    "description": t('structuredData.appDescription'),
    "foundingDate": "2025-06-26T00:00:00Z",
    "knowsAbout": [
      "Image Splitting",
      "Instagram Grid Making",
      "Image Processing",
      "Social Media Tools"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://aiimagesplitter.com",
      "availableLanguage": ["en", "zh-CN", "vi", "ru", "pt", "ms", "kk", "id", "hi", "fil"]
    }
  }

  // 网站结构化数据 - 移除不适用于WebSite类型的primaryImageOfPage属性
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": t('structuredData.websiteName'),
    "url": "https://aiimagesplitter.com",
    "image": {
      "@type": "ImageObject",
      "url": "https://aiimagesplitter.com/images/penguin-split.png",
      "width": 600,
      "height": 400,
      "caption": "AI Image Splitter in action"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aiimagesplitter.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  
  // 应用程序结构化数据
  const applicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('structuredData.appName'),
    "description": t('structuredData.appDescription'),
    "url": currentUrl,
    "image": {
      "@type": "ImageObject",
      "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "width": 512,
      "height": 512,
      "caption": "AI Image Splitter - Free Online Image Splitter Tool",
      "contentUrl": "https://aiimagesplitter.com/android-chrome-512x512.png"
    },
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "permissions": "browser",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "author": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "publisher": {
      "@type": "Organization", 
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "featureList": [
      t('structuredData.features.splitImages'),
      t('structuredData.features.instagramGrid'),
      t('structuredData.features.carouselCreation'),
      t('structuredData.features.batchDownload'),
      t('structuredData.features.freeToUse')
    ],
    "screenshot": "https://aiimagesplitter.com/images/screenshot.png"
  }

  // 创意工作结构化数据
  const creativeWorkData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": t('structuredData.creativeWorkName'),
    "description": t('structuredData.creativeWorkDescription'),
    "creator": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png"
      }
    },
    "keywords": t('structuredData.keywords'),
    "genre": t('structuredData.genre'),
    "inLanguage": locale === 'zh-CN' ? "zh-CN" : "en-US"
  }

  // 常见问题结构化数据 - 回到FAQPage但采用最简化结构
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq.whatIsImageSplitter.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.whatIsImageSplitter.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.howToSplitImage.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.howToSplitImage.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.instagramGridMaker.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.instagramGridMaker.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.splitImage3x3.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.splitImage3x3.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.supportedFormats.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.supportedFormats.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.freeToUse.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.freeToUse.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.imageQuality.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.imageQuality.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.privacySecurity.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.privacySecurity.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.mobileFriendly.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.mobileFriendly.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.batchProcessing.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.batchProcessing.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.customDimensions.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.customDimensions.answer')
        }
      }
    ]
  }

  // 文章结构化数据 - 有助于图片在搜索结果中显示
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": t('structuredData.appName'),
    "description": t('structuredData.appDescription'),
    "image": {
      "@type": "ImageObject",
      "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "width": 512,
      "height": 512,
      "caption": "AI Image Splitter Logo"
    },
    "author": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "datePublished": "2025-06-26T00:00:00Z",
    "dateModified": "2025-07-02T12:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
    </Head>
  )
}

export default StructuredData 