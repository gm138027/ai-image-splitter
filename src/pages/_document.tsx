import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 优化字体加载，减少LCP延迟 - 保持原有视觉效果 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* 预加载关键字体文件 - 加速渲染但不改变显示 */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* 关键性能优化meta标签 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        
        {/* 预加载关键字体的CSS文件 */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" as="style" />
        
        {/* Resource Hints for better LCP */}
        <link rel="prefetch" href="/images/penguin-original.png" />
        <link rel="prefetch" href="/images/city-split.png" />
        <link rel="prefetch" href="/images/city-original.png" />
        
        {/* 性能优化meta标签 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        {/* 关键资源预加载 - 不影响视觉但加速LCP */}
        <link rel="preload" href="/images/penguin-split.png" as="image" />
        
        {/* CDN和外部资源预连接 */}
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//unpkg.com" />
        
        {/* 内联关键CSS以减少渲染阻塞 - 保持原有样式不变 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              font-display: swap;
            }
            .text-gradient { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              -webkit-background-clip: text; 
              -webkit-text-fill-color: transparent; 
            }
            /* 基础布局优化 - 不改变视觉效果 */
            * { box-sizing: border-box; }
            html { font-size: 16px; }
            body { margin: 0; padding: 0; }
            /* 减少主线程阻塞的基础优化 */
            .min-h-screen { min-height: 100vh; contain: layout; }
            /* 硬件加速优化 - 不影响视觉 */
            .transform { transform: translateZ(0); }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 