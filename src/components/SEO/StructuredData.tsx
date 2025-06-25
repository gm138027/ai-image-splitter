import Head from 'next/head'
import { useRouter } from 'next/router'

interface StructuredDataProps {
  locale?: string
}

const StructuredData: React.FC<StructuredDataProps> = ({ locale = 'zh-CN' }) => {
  const router = useRouter()
  const currentUrl = `https://aiimagesplitter.com${router.asPath}`
  
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
    "name": locale === 'zh-CN' ? "AI Image Splitter - 在线图像分割器" : "AI Image Splitter - Online Image Splitter Tool",
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
    "name": locale === 'zh-CN' ? "AI Image Splitter - 在线图像分割器" : "AI Image Splitter - Online Image Splitter Tool",
    "description": locale === 'zh-CN' 
      ? "免费在线图片分割工具，专业的图像分割器帮您轻松分割图片为Instagram网格布局。最佳的Instagram网格制作器，支持社交媒体轮播图分割，快速、简单、无水印。"
      : "Free image splitter online tool to split images into perfect grids for Instagram, social media carousels and posts. The best image splitter for Instagram grid maker needs - fast, easy, no watermarks.",
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
      locale === 'zh-CN' ? "图片分割" : "Split Images",
      locale === 'zh-CN' ? "Instagram网格制作" : "Instagram Grid Maker", 
      locale === 'zh-CN' ? "轮播图制作" : "Carousel Image Creation",
      locale === 'zh-CN' ? "批量下载" : "Batch Download",
      locale === 'zh-CN' ? "免费使用" : "Free to Use"
    ],
    "screenshot": "https://aiimagesplitter.com/images/screenshot.png"
  }

  // 创意工作结构化数据
  const creativeWorkData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": locale === 'zh-CN' ? "图像分割工具" : "Image Splitter Tool",
    "description": locale === 'zh-CN'
      ? "专业的在线图像分割器，帮助用户将图片分割成完美的网格布局，特别适用于Instagram和社交媒体内容创作。"
      : "Professional online image splitter tool that helps users split images into perfect grid layouts, especially designed for Instagram and social media content creation.",
    "creator": {
      "@type": "Organization",
      "name": "AI Image Splitter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiimagesplitter.com/android-chrome-512x512.png"
      }
    },
    "keywords": locale === 'zh-CN' 
      ? "图片分割器, 在线图像分割器, 分割图片, 网格制作器, Instagram网格制作器, Instagram图片分割器, 社交媒体, 轮播图, 在线工具"
      : "image splitter, image splitter online, split image, split image online, grid maker, instagram grid maker, image splitter instagram, image splitter for instagram, social media, carousel",
    "genre": locale === 'zh-CN' ? "图像处理工具" : "Image Processing Tool",
    "inLanguage": locale === 'zh-CN' ? "zh-CN" : "en-US"
  }

  // 常见问题结构化数据
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'zh-CN' ? [
      {
        "@type": "Question",
        "name": "如何使用AI Image Splitter分割图片？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "使用我们的在线图像分割器非常简单：1) 上传您的图片，2) 选择分割模式（垂直、水平或网格），3) 设置分割参数，4) 点击分割按钮，5) 下载分割后的图片。整个过程完全免费，无需注册。"
        }
      },
      {
        "@type": "Question", 
        "name": "支持哪些图片格式？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "我们的图像分割器支持所有主流图片格式，包括JPG、PNG、GIF、WebP和BMP格式。最大支持10MB的图片文件。"
        }
      },
      {
        "@type": "Question",
        "name": "分割后的图片可以用于Instagram吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "当然可以！我们的工具专为Instagram设计，支持创建完美的Instagram网格布局和轮播帖子。分割后的图片可以直接上传到Instagram使用。"
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to use AI Image Splitter to split images?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Using our image splitter online tool is simple: 1) Upload your image, 2) Choose split mode (vertical, horizontal, or grid), 3) Set split parameters, 4) Click the split button, 5) Download the split images. The entire process is completely free with no registration required."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our image splitter supports all mainstream image formats including JPG, PNG, GIF, WebP, and BMP formats. Maximum file size supported is 10MB."
        }
      },
      {
        "@type": "Question", 
        "name": "Can the split images be used for Instagram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Our tool is specifically designed for Instagram, supporting the creation of perfect Instagram grid layouts and carousel posts. Split images can be directly uploaded to Instagram."
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