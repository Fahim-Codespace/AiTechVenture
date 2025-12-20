'use client'

import { useState } from 'react'

export default function UnsubscribePage() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!email) {
      return false
    }
    
    if (!emailRegex.test(email)) {
      return false
    }
    
    const domain = email.split('@')[1]
    if (!domain || !domain.includes('.')) {
      return false
    }
    
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2) {
      return false
    }
    
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData({ ...formData, email })
    
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

    const trimmedEmail = formData.email.trim()
    if (!validateEmail(trimmedEmail)) {
      setStatus('error')
      setEmailError('Please enter a valid email address')
      setMessage('Invalid email address. Please check and try again.')
      return
    }

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('You have been successfully unsubscribed. We\'re sorry to see you go!')
        setFormData({ email: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to unsubscribe. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
              Unsubscribe
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            We're Sorry to See You Go
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We understand that your inbox can get crowded. If you'd like to unsubscribe from our newsletter, 
            please enter your email address below. You can always resubscribe anytime in the future.
          </p>
        </div>

        {/* Farewell Message Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Thank You for Being Part of Our Community</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We're grateful for the time you've spent with us. Your support has meant a lot, and we hope 
                you found value in our weekly insights about AI and technology.
              </p>
              <p className="text-gray-400 text-sm">
                If you change your mind, you can always come back and resubscribe. We'll be here whenever you're ready!
              </p>
            </div>
          </div>
        </div>

        {/* Unsubscribe Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Unsubscribe from Newsletter</h2>
          <p className="text-gray-400 text-center mb-6">
            Enter your email address to unsubscribe
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:ring-orange-500 focus:border-transparent'
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
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-orange-500/50"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unsubscribing...
                </span>
              ) : status === 'success' ? (
                'Unsubscribed Successfully'
              ) : (
                'Unsubscribe'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              <a href="/newsletter" className="text-blue-400 hover:text-blue-300 underline">
                Changed your mind? Resubscribe here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}







