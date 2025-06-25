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
        "name": "什么是图片分割工具，它是如何工作的？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "图片分割工具是一种数字化工具，可以将单张图片分割成多个较小的部分。我们的网页版图像分割器使用先进算法将您的图像分割成完美的网格或片段。只需上传图片，选择图像分割方式，然后下载结果。所有处理都在您的浏览器中完成，确保图片隐私安全。"
        }
      },
      {
        "@type": "Question",
        "name": "如何将图片分割成多个部分？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "操作很简单：1）上传您的图片（支持JPG、PNG、GIF等，最大10MB），2）选择您喜欢的分割模式 - 垂直分割、水平分割或网格分割，3）调整行数和列数，4）点击分割图像按钮，5）下载单个片段或获取ZIP打包文件。"
        }
      },
      {
        "@type": "Question",
        "name": "我可以用这个工具制作Instagram网格帖子吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "当然可以！我们的图像分割器非常适合制作Instagram网格布局和轮播帖子。热门格式包括用于动态拼图的3x3网格、用于轮播故事的条带，以及适合独特布局的自定义尺寸。输出确保完美符合Instagram的要求。"
        }
      },
      {
        "@type": "Question",
        "name": "支持哪些文件格式？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "我们的图像分割器支持所有常见的图片格式，包括JPG、PNG、GIF和WebP等。您也可以将分割后的图片导出为JPG、PNG、WebP或BMP格式。最大文件大小为10MB，尺寸最高支持4096x4096像素以获得最佳性能。"
        }
      },
      {
        "@type": "Question",
        "name": "这个工具完全免费吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是的，我们图像分割器100%免费，没有任何隐藏费用。您的图片上不会有水印，无需注册账户，也没有使用限制。无论是个人项目、商业内容还是商用目的，都可以无限制使用。"
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "What is an image splitter and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An image splitter is a digital tool that divides a single image into multiple smaller parts. Our web-based image splitter uses advanced algorithms to split your images into perfect grids or segments. Simply upload your image, choose your image splitting method, and download the results. All processing happens directly in your browser, ensuring your image privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "How do I split an image into multiple parts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's simple: 1) Upload your image (supports JPG, PNG, GIF, etc., max 10MB), 2) Choose your preferred splitting mode - vertical split, horizontal split, or grid split, 3) Adjust rows and columns, 4) Click the split image button, 5) Download individual segments or get a ZIP package."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this tool to create Instagram grid posts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Our image splitter is perfect for creating Instagram grid layouts and carousel posts. Popular formats include 3x3 grids for feed puzzles, strips for carousel stories, and custom dimensions for unique layouts. The output ensures perfect compatibility with Instagram requirements."
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
        "name": "Is this tool completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our image splitter is 100% free with no hidden costs. There are no watermarks on your images, no account registration required, and no usage limits. Whether for personal projects, commercial content, or business purposes, you can use it unlimited."
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