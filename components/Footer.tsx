'use client'

import Link from 'next/link'
import { useSubscriptionModal } from './SubscriptionModalContext'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const { openModal } = useSubscriptionModal()
  const pathname = usePathname()
  
  const handleSubscribeClick = (e: React.MouseEvent) => {
    if (pathname !== '/newsletter') {
      e.preventDefault()
      openModal()
    }
  }
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-white font-bold text-xl">AiTechVenture</span>
            </div>
            <p className="text-gray-400 text-sm">
              Exploring the latest AI and modern technologies. Stay ahead of the curve.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tech" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Technologies
                </Link>
              </li>
              <li>
                <Link href="/ai-models" className="text-gray-400 hover:text-white transition-colors text-sm">
                  AI Models
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates on AI and technology.
            </p>
            <Link 
              href="/newsletter"
              onClick={handleSubscribeClick}
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm"
            >
              Subscribe Now
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AiTechVenture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

