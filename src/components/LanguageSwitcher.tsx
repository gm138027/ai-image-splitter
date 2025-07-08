import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from 'next-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === router.locale)

  const handleLanguageChange = (lng: string) => {
    // 使用Next.js官方locale切换机制，保证路径永远只有一个前缀
    router.push(router.pathname, router.asPath, { locale: lng })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label={t('language.switchLanguage')}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag}
          <span className="hidden sm:inline ml-1">{currentLanguage?.name}</span>
        </span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    language.code === router.locale 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{language.flag}</span>
                  <span className="truncate">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher 