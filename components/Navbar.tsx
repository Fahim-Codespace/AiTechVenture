'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSubscriptionModal } from './SubscriptionModalContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useSubscriptionModal()
  
  const handleSubscribeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openModal()
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-white font-bold text-xl">AiTechVenture</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/tech" className="text-gray-300 hover:text-white transition-colors">
              Technologies
            </Link>
            <Link href="/ai-models" className="text-gray-300 hover:text-white transition-colors">
              AI Models
            </Link>
            <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
              News
            </Link>
            <Link href="/newsletter" className="text-gray-300 hover:text-white transition-colors">
              Newsletter
            </Link>
            <Link 
              href="/newsletter" 
              onClick={handleSubscribeClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-300 hover:text-white transition-colors py-2">
              Home
            </Link>
            <Link href="/tech" className="block text-gray-300 hover:text-white transition-colors py-2">
              Technologies
            </Link>
            <Link href="/ai-models" className="block text-gray-300 hover:text-white transition-colors py-2">
              AI Models
            </Link>
            <Link href="/news" className="block text-gray-300 hover:text-white transition-colors py-2">
              News
            </Link>
            <Link href="/newsletter" className="block text-gray-300 hover:text-white transition-colors py-2">
              Newsletter
            </Link>
            <Link 
              href="/newsletter" 
              onClick={handleSubscribeClick}
              className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Subscribe
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

