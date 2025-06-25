import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  onLogoClick?: () => void
  isInToolMode?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, onLogoClick, isInToolMode = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(217, 70, 239, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <Header onLogoClick={onLogoClick} isInToolMode={isInToolMode} />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout 