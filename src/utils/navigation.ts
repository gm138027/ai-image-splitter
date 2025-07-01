import { NextRouter } from 'next/router'

/**
 * Global navigation utility class - provides unified cross-page navigation functionality
 * Follows SOLID principles, single responsibility for handling navigation logic
 */
export class NavigationUtils {
  /**
   * Smart navigation to specified anchor on homepage
   * @param router Next.js router instance
   * @param targetId Target anchor ID
   * @param onLogoClick Callback function to reset tool state (optional)
   * @param isInToolMode Whether in tool mode (optional)
   */
  static async navigateToHomeSection(
    router: NextRouter,
    targetId: string,
    onLogoClick?: () => void,
    isInToolMode: boolean = false
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      // If currently on homepage
      if (currentPath === '/') {
        // If in tool mode, reset state first
        if (isInToolMode && onLogoClick) {
          onLogoClick()
          // Wait for state reset
          await this.scrollToElementWithRetry(targetId, 100)
        } else {
          // Scroll directly to target element
          await this.scrollToElementWithRetry(targetId, 0)
        }
      } else {
        // If not on homepage, navigate to homepage first, then scroll to target
        await router.push('/')
        // Wait for page load completion then scroll
        await this.scrollToElementWithRetry(targetId, 100)
      }
    } catch (error) {
      console.warn('Navigation error:', error)
      // At least navigate to homepage on error
      if (currentPath !== '/') {
        await router.push('/')
      }
    }
  }

  /**
   * Smart navigation to homepage top
   * @param router Next.js router instance
   * @param onLogoClick Callback function to reset tool state (optional)
   * @param isInToolMode Whether in tool mode (optional)
   */
  static async navigateToHome(
    router: NextRouter,
    onLogoClick?: () => void,
    isInToolMode: boolean = false
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      if (currentPath === '/') {
        // If on homepage, handle tool mode or scroll to top
        if (isInToolMode && onLogoClick) {
          onLogoClick() // Reset to homepage state
        } else {
          this.scrollToTop()
        }
      } else {
        // If not on homepage, navigate to homepage
        await router.push('/')
        // Scroll to top after page load
        setTimeout(() => {
          this.scrollToTop()
        }, 100)
      }
    } catch (error) {
      console.warn('Home navigation error:', error)
    }
  }

  /**
   * Scroll to page top
   */
  static scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * Scroll to specified element with retry mechanism
   * @param targetId Target element ID
   * @param delay Delay time in milliseconds
   * @param maxRetries Maximum retry attempts
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
            // Recursive retry
            attemptScroll(attempt + 1).then(resolve)
          } else {
            console.warn(`Element with id "${targetId}" not found after ${maxRetries} attempts`)
            resolve()
          }
        }, delay + (attempt * 100)) // Increase delay by 100ms for each retry
      })
    }

    return attemptScroll(1)
  }

  /**
   * Check if currently on homepage
   * @param router Next.js router instance
   */
  static isOnHomePage(router: NextRouter): boolean {
    return router.pathname === '/'
  }

  /**
   * Check if specified anchor exists on current page
   * @param targetId Target anchor ID
   */
  static isElementExists(targetId: string): boolean {
    return document.getElementById(targetId) !== null
  }

  /**
   * Get configuration for all homepage navigation targets
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
   * Smart LOGO navigation handler
   * @param router Next.js router instance
   * @param onLogoClick Callback function to reset tool state (optional)
   */
  static async handleLogoNavigation(
    router: NextRouter,
    onLogoClick?: () => void
  ): Promise<void> {
    const currentPath = router.pathname
    
    try {
      if (currentPath === '/') {
        // If on homepage, reset state and scroll to top
        if (onLogoClick) {
          onLogoClick()
          // Scroll to top after state reset
          setTimeout(() => {
            this.scrollToTop()
          }, 100)
        } else {
          // Scroll directly to top
          this.scrollToTop()
        }
      } else {
        // If not on homepage, navigate to homepage
        await router.push('/')
        // Scroll to top after page load
        setTimeout(() => {
          this.scrollToTop()
        }, 100)
      }
    } catch (error) {
      console.warn('Logo navigation error:', error)
      // At least try to navigate to homepage on error
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