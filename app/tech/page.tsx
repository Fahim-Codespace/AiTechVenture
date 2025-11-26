'use client'

import Link from 'next/link'
import { useSubscriptionModal } from '@/components/SubscriptionModalContext'
import { usePathname } from 'next/navigation'

const technologies = [
  {
    title: 'Large Language Models',
    description: 'Exploring GPT, Claude, and other advanced language models that are transforming how we interact with AI.',
    icon: '🤖',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Computer Vision',
    description: 'Latest developments in image recognition, object detection, and visual AI applications.',
    icon: '👁️',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Neural Networks',
    description: 'Deep learning architectures and neural network innovations pushing the boundaries of AI.',
    icon: '🧠',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Quantum Computing',
    description: 'The intersection of quantum mechanics and computing, opening new possibilities for AI.',
    icon: '⚛️',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Edge AI',
    description: 'AI models running on edge devices, bringing intelligence closer to where it\'s needed.',
    icon: '📱',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'AI Ethics & Safety',
    description: 'Responsible AI development, bias mitigation, and ensuring AI benefits all of humanity.',
    icon: '⚖️',
    gradient: 'from-red-500 to-rose-500',
  },
]

export default function TechPage() {
  const { openModal } = useSubscriptionModal()
  const pathname = usePathname()
  
  const handleSubscribeClick = (e: React.MouseEvent) => {
    if (pathname !== '/newsletter') {
      e.preventDefault()
      openModal()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Technologies
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Exploring Modern Technologies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Dive into the cutting-edge technologies shaping our future
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${tech.gradient} rounded-lg flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                {tech.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{tech.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Latest Tech
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for weekly updates on these technologies and more
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
      </div>
    </div>
  )
}

