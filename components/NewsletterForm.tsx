'use client'

import { useState, useContext } from 'react'
import { SubscriptionModalContext } from './SubscriptionModalContext'

export default function NewsletterForm() {
  const modalContext = useContext(SubscriptionModalContext)
  const closeModal = modalContext?.closeModal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  // Email validation function
  const validateEmail = (email: string): boolean => {
    // RFC 5322 compliant email regex (simplified but robust)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!email) {
      return false
    }
    
    // Check basic format
    if (!emailRegex.test(email)) {
      return false
    }
    
    // Additional checks for common junk patterns
    const junkPatterns = [
      /^test@/i,
      /^admin@/i,
      /^noreply@/i,
      /@test\./i,
      /@example\./i,
      /@localhost/i,
      /\.test$/i,
      /^[a-z]+@[a-z]+$/i, // Simple pattern like "abc@def" without proper domain
    ]
    
    // Check for junk patterns
    if (junkPatterns.some(pattern => pattern.test(email))) {
      return false
    }
    
    // Check for minimum length and proper structure
    if (email.length < 5 || !email.includes('@') || !email.includes('.')) {
      return false
    }
    
    // Check domain has at least one dot after @
    const domain = email.split('@')[1]
    if (!domain || !domain.includes('.')) {
      return false
    }
    
    // Check TLD is at least 2 characters
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2) {
      return false
    }
    
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData({ ...formData, email })
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('')
    }
  }

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim()
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    setEmailError('')

    // Validate email before submitting
    const trimmedEmail = formData.email.trim()
    if (!validateEmail(trimmedEmail)) {
      setStatus('error')
      setEmailError('Please enter a valid email address')
      setMessage('Invalid email address. Please check and try again.')
      return
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: trimmedEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed! Check your email for confirmation.')
        setFormData({ name: '', email: '' })
        // Close modal after 2 seconds on success (if in modal context)
        if (closeModal) {
          setTimeout(() => {
            closeModal()
          }, 2000)
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          pattern="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*"
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
            emailError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-700 focus:ring-blue-500 focus:border-transparent'
          }`}
          placeholder="Enter your email"
        />
        {emailError && (
          <p className="mt-2 text-sm text-red-400">{emailError}</p>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            status === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/50"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subscribing...
          </span>
        ) : (
          'Subscribe to Newsletter'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to receive our weekly newsletter. You can unsubscribe at any time.
      </p>
    </form>
  )
}

