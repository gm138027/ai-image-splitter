import React from 'react'
import Link from 'next/link'
import { Trans, useTranslation } from 'next-i18next'
import { Upload, Grid3X3, Download, ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import FAQ from '@/components/FAQ'
import type { HeroSectionProps } from '@/types'

interface AdvantageItem {
  title: string
  description: string
}

interface ProTipItem {
  title: string
  description: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onDrop,
  onFileInputChange,
  fileInputRef
}) => {
  const { t } = useTranslation('common')
  const advantageGroup1 = t('advantages.group1.items', {
    returnObjects: true
  }) as AdvantageItem[]
  const advantageGroup2 = t('advantages.group2.items', {
    returnObjects: true
  }) as AdvantageItem[]
  const useCases = t('useCases.items', {
    returnObjects: true
  }) as AdvantageItem[]
  const proTips = t('proTips.items', {
    returnObjects: true
  }) as ProTipItem[]
  
  // Simplified error handling - no complex state management needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
              {/* Background decorative elements - lazy loaded */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        {/* Hero Section - critical above-the-fold content */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
            <Trans
              i18nKey="hero.description"
              components={{
                link: (
                  <Link
                    href="/#how-it-works"
                    className="text-primary-600 hover:text-primary-700 font-semibold underline-offset-2 hover:underline"
                  />
                )
              }}
            />
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern-lg border border-white/20 p-6 sm:p-10 mb-16 hover:shadow-purple-lg transition-all duration-500">
          <div
            className="border-2 border-dashed border-primary-300/50 rounded-2xl p-8 sm:p-16 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group"
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('tool.uploadPrompt')}
            </h3>
            <button className="bg-gradient-blue text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300 mb-4 sm:mb-6">
              {t('tool.uploadButton')}
            </button>
            <p className="text-gray-500 text-base sm:text-lg">
              {t('tool.uploadSupport')}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileInputChange}
            className="hidden"
          />
        </div>

        {/* How It Works Section */}
        <div className="mt-16 sm:mt-24" id="how-it-works">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('howItWorks.title')}
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-10">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t('howItWorks.step1Title')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                {t('howItWorks.step1Description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300">
                <Grid3X3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t('howItWorks.step2Title')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                {t('howItWorks.step2Description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-modern rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t('howItWorks.step3Title')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                {t('howItWorks.step3Description')}
              </p>
            </div>
          </div>
        </div>

        {/* About AI Image Splitter */}
        <div className="mt-20 sm:mt-24 mb-12 sm:mb-16 text-center px-4 sm:px-0">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-10">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('aboutTool.title')}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl sm:max-w-4xl mx-auto text-left md:text-center">
            {t('aboutTool.descriptionMain')}
          </p>
        </div>

        {/* Advantages Section - optimized image loading strategy */}
        <div className="mt-16 sm:mt-24" id="advantages">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('advantages.title')}
            </span>
          </h2>
          
          {/* Free Online Advantage */}
          <div className="mb-12 sm:mb-20">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-12">
              {/* Left side - Images */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="flex gap-4 sm:gap-8 items-center">
                  {/* Original image (small, left side) */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-blue-300 shadow-md overflow-hidden relative">
                      <Image
                        src="/images/penguin-original.png"
                        alt={t('images.gridExampleAlt')}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="(max-width: 640px) 80px, 128px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                  
                  {/* Arrow with gradient color */}
                  <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-gradient-modern rounded-full shadow-modern-lg animate-pulse-slow">
                    <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  {/* Split grid image (large, right side) */}
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-200 to-blue-400 shadow-lg overflow-hidden relative">
                      <Image
                        src="/images/penguin-split.png"
                        alt={t('images.gridExampleAlt')}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        quality={80}
                        sizes="(max-width: 640px) 128px, 192px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Text */}
              <div className="lg:w-1/2">
                {advantageGroup1.map((item, index) => (
                  <div key={`advantage-1-${index}`} className="mb-6 last:mb-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

                      {/* Easy Instagram Advantage - lazy load these images */}
          <div className="mb-12 sm:mb-20">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-6 sm:gap-12">
              {/* Right side - Images */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="flex gap-4 sm:gap-8 items-center">
                  {/* Split grid image (large, left side) */}
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-purple-200 to-purple-400 shadow-lg overflow-hidden relative">
                      <Image
                        src="/images/city-split.png"
                        alt={t('images.carouselExampleAlt')}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="(max-width: 640px) 128px, 192px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                  
                  {/* Arrow with gradient color */}
                  <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-gradient-modern rounded-full shadow-modern-lg animate-pulse-slow">
                    <ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  {/* Original image (small, right side) */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-100 to-purple-300 shadow-md overflow-hidden relative">
                      <Image
                        src="/images/city-original.png"
                        alt={t('images.carouselExampleAlt')}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="(max-width: 640px) 80px, 128px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left side - Text */}
              <div className="lg:w-1/2 lg:text-right">
                {advantageGroup2.map((item, index) => (
                  <div key={`advantage-2-${index}`} className="mb-6 last:mb-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-left lg:text-right">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-left lg:text-right">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-16 sm:mt-24" id="use-cases">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('useCases.title')}
            </span>
          </h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {useCases.map((item, index) => (
              <div
                key={`use-case-${index}`}
                className="bg-white/80 backdrop-blur rounded-2xl border border-white/40 shadow-modern-lg p-6 sm:p-8 text-left"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="mt-16 sm:mt-24" id="pro-tips">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
                {t('proTips.title')}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {t('proTips.subtitle')}
            </p>
          </div>
          <div className="space-y-6">
            {proTips.map((item, index) => (
              <div
                key={`pro-tip-${index}`}
                className="bg-white/80 backdrop-blur rounded-2xl border border-white/40 shadow-modern-lg p-6 sm:p-8"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  )
}

export default HeroSection 
