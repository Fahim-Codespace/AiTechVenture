'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSubscriptionModal } from '@/components/SubscriptionModalContext'
import { usePathname } from 'next/navigation'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  image?: string
  source: string
  category: string
}

const categoryGradients: Record<string, string> = {
  'AI News': 'from-blue-500 to-cyan-500',
  'AI Research': 'from-purple-500 to-pink-500',
  'Tech Giants': 'from-amber-500 to-orange-500',
  'Business Deals': 'from-green-500 to-emerald-500',
  'Default': 'from-blue-500 to-purple-500',
}

function getCategoryGradient(category: string): string {
  return categoryGradients[category] || categoryGradients['Default']
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
  } catch {
    return 'Recently'
  }
}

export default function NewsPage() {
  const { openModal } = useSubscriptionModal()
  const pathname = usePathname()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubscribeClick = (e: React.MouseEvent) => {
    if (pathname !== '/newsletter') {
      e.preventDefault()
      openModal()
    }
  }

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/news')
        const data = await response.json()
        
        if (response.ok && data.news) {
          setNews(data.news)
        } else {
          setError('Failed to load news. Please try again later.')
        }
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Latest News
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI & Technology News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest developments in AI, tech giants, business deals, and new AI model launches from trusted sources
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-lg">Fetching latest news...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => {
              const gradient = getCategoryGradient(item.category)
              return (
                <article
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] group cursor-pointer"
                  onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}
                >
                  {/* Image */}
                  {item.image ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
                    </div>
                  ) : (
                    <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
                  )}

                  <div className="p-6">
                    {/* Category and Date */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-medium rounded-full`}>
                        {item.category}
                      </span>
                      <span className="text-gray-500 text-xs">{formatDate(item.pubDate)}</span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{item.source}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.contentSnippet || 'Read more about this story...'}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 text-sm font-medium transition-colors">
                      <span>Read More</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No news available at the moment. Please check back later.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        {!loading && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Get Weekly News Delivered
              </h2>
              <p className="text-gray-300 mb-8">
                Subscribe to our newsletter and receive curated news with images every week
              </p>
              <Link
                href="/newsletter"
                onClick={handleSubscribeClick}
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

