'use client'

import { useSubscriptionModal } from './SubscriptionModalContext'
import NewsletterForm from './NewsletterForm'
import { useEffect } from 'react'

export default function SubscriptionModal() {
  const { isOpen, closeModal } = useSubscriptionModal()

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeModal])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className="relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <div className="inline-block mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30 uppercase tracking-wide">
                Newsletter
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-400">
              Get weekly insights on the latest AI breakthroughs and technological innovations.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </div>
  )
}











