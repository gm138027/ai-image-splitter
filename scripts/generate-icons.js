const fs = require('fs')
const path = require('path')

// 生成SVG格式的logo
function generateLogoSVG() {
  return `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景圆角矩形 -->
  <rect width="512" height="512" rx="80" ry="80" fill="url(#bgGradient)"/>
  
  <!-- 剪刀图标 -->
  <g transform="translate(128, 128)">
    <!-- 剪刀主体 -->
    <path d="M128 48 L192 112 L128 176 L112 160 L160 112 L112 64 Z" fill="url(#iconGradient)" stroke="none"/>
    <path d="M128 208 L192 144 L128 80 L112 96 L160 144 L112 192 Z" fill="url(#iconGradient)" stroke="none"/>
    
    <!-- 剪刀手柄 -->
    <circle cx="112" cy="64" r="24" fill="url(#iconGradient)"/>
    <circle cx="112" cy="192" r="24" fill="url(#iconGradient)"/>
    
    <!-- 切割线 -->
    <line x1="192" y1="112" x2="240" y2="112" stroke="url(#iconGradient)" stroke-width="8" stroke-linecap="round"/>
    <line x1="192" y1="144" x2="240" y2="144" stroke="url(#iconGradient)" stroke-width="8" stroke-linecap="round"/>
    
    <!-- AI装饰元素 -->
    <circle cx="224" cy="80" r="4" fill="url(#iconGradient)" opacity="0.8"/>
    <circle cx="240" cy="96" r="4" fill="url(#iconGradient)" opacity="0.8"/>
    <circle cx="224" cy="176" r="4" fill="url(#iconGradient)" opacity="0.8"/>
    <circle cx="240" cy="160" r="4" fill="url(#iconGradient)" opacity="0.8"/>
  </g>
</svg>
  `.trim()
}

// 创建目标目录
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 生成SVG文件
const logoSVG = generateLogoSVG()
fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSVG)

console.log('✅ SVG logo generated successfully!')
console.log('📁 Saved to: public/logo.svg')
console.log('')
console.log('🔄 Next steps:')
console.log('1. Convert SVG to PNG formats using online tools:')
console.log('   - favicon-16x16.png (16x16)')
console.log('   - favicon-32x32.png (32x32)')
console.log('   - apple-touch-icon.png (180x180)')
console.log('   - android-chrome-192x192.png (192x192)')
console.log('   - android-chrome-512x512.png (512x512)')
console.log('   - favicon.ico (16x16, 32x32)')
console.log('')
console.log('2. Recommended online converter: https://realfavicongenerator.net/')
console.log('3. Or use: https://favicon.io/favicon-converter/') 