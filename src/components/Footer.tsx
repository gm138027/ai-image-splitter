import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Heart } from 'lucide-react'

const Footer: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-white border-t border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="flex flex-col items-center md:items-start text-gray-600 text-sm text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2">
              <span>© 2026 AI Image Splitter.</span>
              <span className="flex items-center">
                {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 mx-1" /> {t('footer.forUsers')}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500 max-w-2xl">
              {t('footer.brandNameNote')}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 mt-4 md:mt-0 relative z-10">
            <Link
              href="/contact"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              {t('footer.contact', { defaultValue: 'Contact' })}
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
