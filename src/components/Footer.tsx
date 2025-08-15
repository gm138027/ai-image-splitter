import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Heart } from 'lucide-react'

const Footer: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('隐私政策链接被点击')
    router.push('/privacy')
  }

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('条款链接被点击')
    router.push('/terms')
  }



  return (
    <footer className="bg-white border-t border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <span>© 2025 AI Image Splitter.</span>
            <span className="flex items-center">
              {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 mx-1" /> {t('footer.forUsers')}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 mt-4 md:mt-0 relative z-10">
            <button
              onClick={handlePrivacyClick}
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {t('footer.privacy')}
            </button>
            <button
              onClick={handleTermsClick}
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {t('footer.terms')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 