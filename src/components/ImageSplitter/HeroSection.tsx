import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Upload, Grid3X3, Download, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import FAQ from '@/components/FAQ'
import type { HeroSectionProps } from '@/types'

const HeroSection: React.FC<HeroSectionProps> = ({
  onFileUpload,
  onDrop,
  onFileInputChange,
  fileInputRef
}) => {
  const { t } = useTranslation('common')
  
  // Simplified error handling - no complex state management needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Background decorative elements - 延迟加载 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section - 关键首屏内容 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern-lg border border-white/20 p-10 mb-16 hover:shadow-purple-lg transition-all duration-500">
          <div
            className="border-2 border-dashed border-primary-300/50 rounded-2xl p-16 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group"
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-8 hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('tool.uploadPrompt')}
            </h3>
            <button className="bg-gradient-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300 mb-6">
              {t('tool.uploadButton')}
            </button>
            <p className="text-gray-500 text-lg">
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
        <div className="mt-24" id="how-it-works">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('howItWorks.title')}
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step1Title')}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('howItWorks.step1Description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Grid3X3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step2Title')}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('howItWorks.step2Description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-modern rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Download className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step3Title')}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('howItWorks.step3Description')}
              </p>
            </div>
          </div>
        </div>

        {/* Advantages Section - 优化图片加载策略 */}
        <div className="mt-24" id="advantages">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {t('advantages.title')}
            </span>
          </h2>
          
          {/* Free Online Advantage */}
          <div className="mb-20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left side - Images */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="flex gap-8 items-center">
                  {/* Original image (small, left side) */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-300 shadow-md overflow-hidden relative">
                      <Image
                        src="/images/penguin-original.png"
                        alt={t('images.gridExampleAlt')}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="128px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                  
                  {/* Arrow with gradient color */}
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-modern rounded-full shadow-modern-lg animate-pulse-slow">
                    <ArrowRight className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Split grid image (large, right side) - 这是LCP元素，需要最高优先级 */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-200 to-blue-400 shadow-lg overflow-hidden relative">
                      <Image
                        src="/images/penguin-split.png"
                        alt={t('images.gridExampleAlt')}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        priority={true}
                        quality={80}
                        sizes="(max-width: 768px) 192px, 192px"
                        fetchPriority="high"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Text */}
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('advantages.freeOnline.title')}
                </h3>
                <p 
                  className="text-xl text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('advantages.freeOnline.description') }}
                />
              </div>
            </div>
          </div>

          {/* Easy Instagram Advantage - 延迟加载这部分图片 */}
          <div className="mb-20">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              {/* Right side - Images */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="flex gap-8 items-center">
                  {/* Split grid image (large, left side) */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-200 to-purple-400 shadow-lg overflow-hidden relative">
                      <Image
                        src="/images/city-split.png"
                        alt={t('images.carouselExampleAlt')}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="192px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                  
                  {/* Arrow with gradient color */}
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-modern rounded-full shadow-modern-lg animate-pulse-slow">
                    <ArrowLeft className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Original image (small, right side) */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-300 shadow-md overflow-hidden relative">
                      <Image
                        src="/images/city-original.png"
                        alt={t('images.carouselExampleAlt')}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority={false}
                        quality={75}
                        sizes="128px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left side - Text */}
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('advantages.easyInstagram.title')}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('advantages.easyInstagram.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  )
}

export default HeroSection 