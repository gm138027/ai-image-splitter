import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 优化字体加载，减少LCP延迟 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* 性能优化meta标签 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        {/* 内联关键CSS以减少渲染阻塞 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
            .text-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
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