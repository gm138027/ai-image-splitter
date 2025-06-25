import { NextRouter } from 'next/router'

/**
 * 全局导航工具类 - 提供统一的跨页面导航功能
 * 遵循SOLID原则，单一职责处理导航逻辑
 */
export class NavigationUtils {
  /**
   * 智能导航到首页的指定锚点
   * @param router Next.js路由器实例
   * @param targetId 目标锚点ID
   * @param onLogoClick 重置工具状态的回调函数（可选）
   * @param isInToolMode 是否在工具模式（可选）
   */
  static async navigateToHomeSection(
    router: NextRouter,
    targetId: string,
    onLogoClick?: () => void,
    isInToolMode: boolean = false
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      // 如果当前在首页
      if (currentPath === '/') {
        // 如果在工具模式，先重置状态
        if (isInToolMode && onLogoClick) {
          onLogoClick()
          // 等待状态重置
          await this.scrollToElementWithRetry(targetId, 100)
        } else {
          // 直接滚动到目标元素
          await this.scrollToElementWithRetry(targetId, 0)
        }
      } else {
        // 如果不在首页，先导航到首页，然后滚动到目标
        await router.push('/')
        // 等待页面加载完成后滚动
        await this.scrollToElementWithRetry(targetId, 100)
      }
    } catch (error) {
      console.warn('Navigation error:', error)
      // 出错时至少导航到首页
      if (currentPath !== '/') {
        await router.push('/')
      }
    }
  }

  /**
   * 智能导航到首页顶部
   * @param router Next.js路由器实例
   * @param onLogoClick 重置工具状态的回调函数（可选）
   * @param isInToolMode 是否在工具模式（可选）
   */
  static async navigateToHome(
    router: NextRouter,
    onLogoClick?: () => void,
    isInToolMode: boolean = false
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      if (currentPath === '/') {
        // 如果在首页，处理工具模式或滚动到顶部
        if (isInToolMode && onLogoClick) {
          onLogoClick() // 重置到首页状态
        } else {
          this.scrollToTop()
        }
      } else {
        // 如果不在首页，导航到首页
        await router.push('/')
        // 页面加载后滚动到顶部
        setTimeout(() => {
          this.scrollToTop()
        }, 100)
      }
    } catch (error) {
      console.warn('Home navigation error:', error)
    }
  }

  /**
   * 滚动到页面顶部
   */
  static scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * 滚动到指定元素，支持重试机制
   * @param targetId 目标元素ID
   * @param delay 延迟时间（毫秒）
   * @param maxRetries 最大重试次数
   */
  static async scrollToElementWithRetry(
    targetId: string,
    delay: number = 0,
    maxRetries: number = 3
  ): Promise<void> {
    const attemptScroll = (attempt: number): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const element = document.getElementById(targetId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            resolve()
          } else if (attempt < maxRetries) {
            // 递归重试
            attemptScroll(attempt + 1).then(resolve)
          } else {
            console.warn(`Element with id "${targetId}" not found after ${maxRetries} attempts`)
            resolve()
          }
        }, delay + (attempt * 100)) // 每次重试增加100ms延迟
      })
    }

    return attemptScroll(1)
  }

  /**
   * 检查当前是否在首页
   * @param router Next.js路由器实例
   */
  static isOnHomePage(router: NextRouter): boolean {
    return router.pathname === '/'
  }

  /**
   * 检查指定锚点是否存在于当前页面
   * @param targetId 目标锚点ID
   */
  static isElementExists(targetId: string): boolean {
    return document.getElementById(targetId) !== null
  }

  /**
   * 获取所有首页导航目标的配置
   */
  static getHomeNavigationTargets() {
    return {
      features: { id: 'features', requiresHome: true },
      howItWorks: { id: 'how-it-works', requiresHome: true },
      faq: { id: 'faq', requiresHome: true },
      advantages: { id: 'advantages', requiresHome: true }
    }
  }

  /**
   * 智能LOGO导航处理
   * @param router Next.js路由器实例
   * @param onLogoClick 重置工具状态的回调函数（可选）
   */
  static async handleLogoNavigation(
    router: NextRouter,
    onLogoClick?: () => void
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      if (currentPath === '/') {
        // 如果在首页，重置状态并滚动到顶部
        if (onLogoClick) {
          onLogoClick()
          // 等待状态重置后滚动到顶部
          setTimeout(() => {
            this.scrollToTop()
          }, 100)
        } else {
          // 直接滚动到顶部
          this.scrollToTop()
        }
      } else {
        // 如果不在首页，导航到首页
        await router.push('/')
        // 页面加载后滚动到顶部
        setTimeout(() => {
          this.scrollToTop()
        }, 100)
      }
    } catch (error) {
      console.warn('Logo navigation error:', error)
      // 出错时至少尝试导航到首页
      if (currentPath !== '/') {
        try {
          await router.push('/')
        } catch (routerError) {
          console.warn('Router navigation failed:', routerError)
        }
      }
    }
  }
} 