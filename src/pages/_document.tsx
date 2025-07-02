import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Critical CSS inlined - system fonts for optimized LCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Font optimization - use system fonts to avoid external loading delays */
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              font-display: swap;
              margin: 0;
              padding: 0;
            }
            
            /* Critical rendering styles */
            .text-gradient { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              -webkit-background-clip: text; 
              -webkit-text-fill-color: transparent; 
            }
            
            /* Core layout styles - prevent layout shifts */
            .max-w-7xl { max-width: 80rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
            .text-center { text-align: center; }
            .mb-16 { margin-bottom: 4rem; }
            .relative { position: relative; }
            
            /* Critical font sizes - immediate rendering */
            .text-5xl { font-size: 3rem; line-height: 1; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .font-bold { font-weight: 700; }
            
            /* Simplified animations - reduce CPU load */
            .simple-fade { opacity: 0; animation: fadeIn 0.6s ease-out forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
            
            /* Disable animations for performance optimization */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `
        }} />
        <style jsx global>{`
          html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 