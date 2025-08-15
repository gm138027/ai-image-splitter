/**
 * FAQ结构化数据组件 - 仅用于首页
 * 
 * 从原StructuredData组件中提取，专门处理FAQ结构化数据
 * 这样可以按需加载，不在每个页面都包含
 */

import Head from 'next/head'
import { useTranslation } from 'next-i18next'

const FAQStructuredData: React.FC = () => {
  const { t } = useTranslation('common')

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

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </Head>
  )
}

export default FAQStructuredData
