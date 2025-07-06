import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'
import { NavigationUtils } from '@/utils/navigation'

interface HeaderProps {
  onLogoClick?: () => void
  isInToolMode?: boolean
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, isInToolMode = false }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogoClick = async () => {
    setIsMobileMenuOpen(false) // 关闭移动端菜单
    await NavigationUtils.handleLogoNavigation(router, onLogoClick)
  }

  // 智能导航处理函数 - 使用NavigationUtils
  const handleSmartNavigation = async (targetId: string) => {
    setIsMobileMenuOpen(false) // 关闭移动端菜单
    await NavigationUtils.navigateToHomeSection(router, targetId, onLogoClick, isInToolMode)
  }

  const handleHomeClick = async () => {
    setIsMobileMenuOpen(false) // 关闭移动端菜单
    await NavigationUtils.navigateToHome(router, onLogoClick, isInToolMode)
  }

  const handleBlogClick = () => {
    setIsMobileMenuOpen(false) // 关闭移动端菜单
  }

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-modern border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
            onClick={handleLogoClick}
            title="返回首页"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shadow-modern overflow-hidden bg-white">
              <Image 
                src="/android-chrome-192x192.png"
                alt="AI Image Splitter Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority={true}
                quality={95}
                sizes="(max-width: 640px) 32px, 40px"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent" role="presentation">
              AI Image Splitter
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:text-primary-600"
              type="button"
            >
              {t('nav.features')}
            </button>
            <button 
              onClick={() => handleSmartNavigation('how-it-works')}
              className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:text-primary-600"
              type="button"
            >
              {t('nav.howItWorks')}
            </button>
            <button 
              onClick={() => handleSmartNavigation('faq')}
              className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:text-primary-600"
              type="button"
            >
              {t('nav.faq')}
            </button>
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:text-primary-600"
              onClick={handleBlogClick}
            >
              {t('nav.about')}
            </Link>
          </nav>

          {/* Mobile menu button & Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              type="button"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200/50">
              <button 
                onClick={handleHomeClick}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                type="button"
              >
                {t('nav.features')}
              </button>
              <button 
                onClick={() => handleSmartNavigation('how-it-works')}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                type="button"
              >
                {t('nav.howItWorks')}
              </button>
              <button 
                onClick={() => handleSmartNavigation('faq')}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                type="button"
              >
                {t('nav.faq')}
              </button>
              <Link 
                href="/blog" 
                className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={handleBlogClick}
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 