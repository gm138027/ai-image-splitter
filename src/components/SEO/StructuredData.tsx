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
    "name": "AI Image Splitter",
    "url": "https://aiimagesplitter.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://aiimagesplitter.com/android-chrome-512x512.png",
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://aiimagesplitter.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://aiimagesplitter.com"
    }
  }

  // 网站结构化数据
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": t('structuredData.websiteName'),
    "url": "https://aiimagesplitter.com",
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
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png"
      }
    },
    "publisher": {
      "@type": "Organization", 
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png"
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

  // 常见问题结构化数据 - 改用QAPage以适应非权威网站
  const faqData = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${currentUrl}#qapage`,
    "name": t('faq.title'),
    "description": t('faq.description'),
    "url": currentUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "about": {
      "@type": "Thing",
      "name": t('structuredData.creativeWorkName')
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "url": "https://aiimagesplitter.com"
    },
    "mainEntity": [
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-1`,
        "name": t('faq.whatIsImageSplitter.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-1`,
          "text": t('faq.whatIsImageSplitter.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-2`,
        "name": t('faq.howToSplitImage.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-2`,
          "text": t('faq.howToSplitImage.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-3`,
        "name": t('faq.instagramGridMaker.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-3`,
          "text": t('faq.instagramGridMaker.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-4`,
        "name": t('faq.splitImage3x3.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-4`,
          "text": t('faq.splitImage3x3.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-5`,
        "name": t('faq.supportedFormats.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-5`,
          "text": t('faq.supportedFormats.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-6`,
        "name": t('faq.freeToUse.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-6`,
          "text": t('faq.freeToUse.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-7`,
        "name": t('faq.imageQuality.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-7`,
          "text": t('faq.imageQuality.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-8`,
        "name": t('faq.privacySecurity.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-8`,
          "text": t('faq.privacySecurity.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-9`,
        "name": t('faq.mobileFriendly.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-9`,
          "text": t('faq.mobileFriendly.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-10`,
        "name": t('faq.batchProcessing.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-10`,
          "text": t('faq.batchProcessing.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      },
      {
        "@type": "Question",
        "@id": `${currentUrl}#qa-question-11`,
        "name": t('faq.customDimensions.question'),
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "@id": `${currentUrl}#qa-answer-11`,
          "text": t('faq.customDimensions.answer'),
          "author": {
            "@type": "Organization",
            "name": "AI Image Splitter"
          }
        }
      }
    ]
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
    </Head>
  )
}

export default StructuredData 