import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 字体优化 - 解决渲染延迟 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* 关键CSS内联 - 减少540ms渲染延迟 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 基础样式 */
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              font-display: swap;
              margin: 0;
              padding: 0;
            }
            
            /* 关键渲染样式 */
            .text-gradient { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              -webkit-background-clip: text; 
              -webkit-text-fill-color: transparent; 
            }
            
            /* 核心布局样式 - 避免布局偏移 */
            .max-w-7xl { max-width: 80rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
            .text-center { text-align: center; }
            .mb-16 { margin-bottom: 4rem; }
            .relative { position: relative; }
            
            /* 关键字体大小 - 立即渲染 */
            .text-5xl { font-size: 3rem; line-height: 1; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .font-bold { font-weight: 700; }
            
            /* 简化动画 - 减少CPU负担 */
            .simple-fade { opacity: 0; animation: fadeIn 0.6s ease-out forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
            
            /* 禁用动画性能优化 */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
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