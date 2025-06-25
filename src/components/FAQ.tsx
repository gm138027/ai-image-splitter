import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const FAQ: React.FC = () => {
  const { t } = useTranslation('common')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // 获取FAQ数据
  const faqData: FAQItem[] = [
    {
      id: 'what-is-image-splitter',
      question: t('faq.whatIsImageSplitter.question'),
      answer: t('faq.whatIsImageSplitter.answer')
    },
    {
      id: 'how-to-split-image',
      question: t('faq.howToSplitImage.question'),
      answer: t('faq.howToSplitImage.answer')
    },
    {
      id: 'instagram-grid-maker',
      question: t('faq.instagramGridMaker.question'),
      answer: t('faq.instagramGridMaker.answer')
    },
    {
      id: 'split-image-3x3',
      question: t('faq.splitImage3x3.question'),
      answer: t('faq.splitImage3x3.answer')
    },
    {
      id: 'supported-formats',
      question: t('faq.supportedFormats.question'),
      answer: t('faq.supportedFormats.answer')
    },
    {
      id: 'free-to-use',
      question: t('faq.freeToUse.question'),
      answer: t('faq.freeToUse.answer')
    },
    {
      id: 'image-quality',
      question: t('faq.imageQuality.question'),
      answer: t('faq.imageQuality.answer')
    },
    {
      id: 'privacy-security',
      question: t('faq.privacySecurity.question'),
      answer: t('faq.privacySecurity.answer')
    },
    {
      id: 'mobile-friendly',
      question: t('faq.mobileFriendly.question'),
      answer: t('faq.mobileFriendly.answer')
    },
    {
      id: 'batch-processing',
      question: t('faq.batchProcessing.question'),
      answer: t('faq.batchProcessing.answer')
    },
    {
      id: 'custom-dimensions',
      question: t('faq.customDimensions.question'),
      answer: t('faq.customDimensions.answer')
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('faq.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('faq.description')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6 mb-16">
          {faqData.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openItems.includes(item.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-5">
                  <div 
                    className="text-gray-700 leading-relaxed prose prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t('faq.cta.title')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('faq.cta.description')}
            </p>
            <button 
              onClick={() => {
                // 滚动到页面顶部的上传工具区域
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              {t('faq.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ 