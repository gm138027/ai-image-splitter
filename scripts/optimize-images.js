const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '../public/images')
const outputDir = imagesDir

// 支持的图片格式
const supportedFormats = ['.png', '.jpg', '.jpeg']

async function optimizeImages() {
  console.log('🚀 开始优化图片...')
  console.log('📁 图片目录:', imagesDir)
  
  try {
    // 检查图片目录是否存在
    if (!fs.existsSync(imagesDir)) {
      console.log('❌ 图片目录不存在:', imagesDir)
      console.log('💡 请确保 public/images 目录存在')
      return
    }
    
    const files = fs.readdirSync(imagesDir)
    console.log('📂 找到文件:', files)
    
    if (files.length === 0) {
      console.log('📭 图片目录为空')
      return
    }
    
    // 检查是否安装了sharp
    let sharp
    try {
      sharp = require('sharp')
    } catch (error) {
      console.log('⚠️  Sharp模块未正确安装')
      console.log('🔧 请运行: npm install sharp --save-dev')
      return
    }
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      
      if (supportedFormats.includes(ext)) {
        const inputPath = path.join(imagesDir, file)
        const outputPath = path.join(outputDir, file.replace(ext, '.webp'))
        
        console.log(`📸 处理图片: ${file}`)
        
        // 检查WebP文件是否已存在
        if (fs.existsSync(outputPath)) {
          console.log(`⏭️  跳过 ${file} (WebP版本已存在)`)
          continue
        }
        
        try {
          // 转换为WebP格式
          await sharp(inputPath)
            .webp({ 
              quality: 85,           // 质量设置为85%，平衡文件大小和质量
              effort: 6              // 压缩努力程度（0-6），6为最高压缩
            })
            .toFile(outputPath)
          
          // 获取文件大小信息
          const originalStats = fs.statSync(inputPath)
          const webpStats = fs.statSync(outputPath)
          const compressionRatio = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1)
          
          console.log(`✅ ${file} -> ${path.basename(outputPath)}`)
          console.log(`   原始大小: ${(originalStats.size / 1024).toFixed(1)}KB`)
          console.log(`   WebP大小: ${(webpStats.size / 1024).toFixed(1)}KB`)
          console.log(`   压缩率: ${compressionRatio}%`)
          console.log('')
        } catch (convertError) {
          console.log(`❌ 转换失败 ${file}:`, convertError.message)
        }
      }
    }
    
    console.log('🎉 图片优化完成!')
    console.log('')
    console.log('📋 使用说明:')
    console.log('1. 现在可以在代码中使用OptimizedImage组件')
    console.log('2. 组件会自动优先加载WebP格式，不支持时fallback到原格式')
    console.log('3. 请确保在生产环境中部署WebP文件')
    
  } catch (error) {
    console.error('❌ 图片优化失败:', error.message)
    console.error('详细错误信息:', error)
  }
}

// 立即执行
optimizeImages() 