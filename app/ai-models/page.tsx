'use client'

import Link from 'next/link'
import { useSubscriptionModal } from '@/components/SubscriptionModalContext'
import { usePathname } from 'next/navigation'

const aiModels = {
  text: [
    {
      name: 'ChatGPT',
      developer: 'OpenAI',
      description: 'Advanced conversational AI with GPT-4 architecture, capable of complex reasoning, coding, and creative writing.',
      features: ['Multi-turn conversations', 'Code generation', 'Creative writing', 'Analysis & summarization'],
      gradient: 'from-green-500 to-emerald-500',
      icon: '💬',
      status: 'Premium & Free tiers',
    },
    {
      name: 'Gemini',
      developer: 'Google DeepMind',
      description: 'Google\'s multimodal AI model with exceptional reasoning capabilities and native multimodal understanding.',
      features: ['Multimodal processing', 'Advanced reasoning', 'Code generation', 'Real-time web search'],
      gradient: 'from-blue-500 to-cyan-500',
      icon: '✨',
      status: 'Free & Pro',
    },
    {
      name: 'Claude',
      developer: 'Anthropic',
      description: 'Constitutional AI model focused on safety, helpfulness, and honesty. Excellent for long-context tasks.',
      features: ['200K+ context window', 'Safe & ethical', 'Long document analysis', 'Creative assistance'],
      gradient: 'from-purple-500 to-pink-500',
      icon: '🧠',
      status: 'Free & Pro',
    },
    {
      name: 'Grok',
      developer: 'xAI',
      description: 'Real-time AI assistant with access to X (Twitter) data, designed for up-to-date information and witty responses.',
      features: ['Real-time X integration', 'Witty personality', 'Current events', 'Code assistance'],
      gradient: 'from-gray-600 to-gray-800',
      icon: '🤖',
      status: 'Premium',
    },
    {
      name: 'DeepSeek',
      developer: 'DeepSeek AI',
      description: 'High-performance open-source language model with strong coding and reasoning capabilities.',
      features: ['Open-source', 'Code-focused', 'Strong reasoning', 'Cost-effective'],
      gradient: 'from-indigo-500 to-blue-500',
      icon: '🔍',
      status: 'Free & Open',
    },
    {
      name: 'Llama',
      developer: 'Meta',
      description: 'Open-source large language model family with strong performance and community-driven development.',
      features: ['Open-source', 'Multiple sizes', 'Fine-tunable', 'Community support'],
      gradient: 'from-orange-500 to-red-500',
      icon: '🦙',
      status: 'Open Source',
    },
  ],
  image: [
    {
      name: 'DALL-E 3',
      developer: 'OpenAI',
      description: 'Advanced text-to-image generation with exceptional prompt understanding and high-quality outputs.',
      features: ['Text-to-image', 'High resolution', 'Prompt understanding', 'Safe generation'],
      gradient: 'from-pink-500 to-rose-500',
      icon: '🎨',
      status: 'Premium',
    },
    {
      name: 'Midjourney',
      developer: 'Midjourney Inc.',
      description: 'Artistic AI image generator known for stunning, artistic, and highly detailed visual creations.',
      features: ['Artistic style', 'High detail', 'Style variations', 'Community-driven'],
      gradient: 'from-purple-500 to-indigo-500',
      icon: '🌌',
      status: 'Subscription',
    },
    {
      name: 'Stable Diffusion',
      developer: 'Stability AI',
      description: 'Open-source image generation model with extensive customization and community models.',
      features: ['Open-source', 'Highly customizable', 'Local deployment', 'Community models'],
      gradient: 'from-cyan-500 to-blue-500',
      icon: '🌀',
      status: 'Open Source',
    },
    {
      name: 'Imagen',
      developer: 'Google',
      description: 'Google\'s text-to-image model with photorealistic outputs and advanced prompt understanding.',
      features: ['Photorealistic', 'High quality', 'Diverse outputs', 'Research-focused'],
      gradient: 'from-yellow-500 to-orange-500',
      icon: '🖼️',
      status: 'Research',
    },
    {
      name: 'Adobe Firefly',
      developer: 'Adobe',
      description: 'Commercial-safe image generation integrated into Adobe Creative Suite with ethical training data.',
      features: ['Commercial use', 'Adobe integration', 'Ethical training', 'Professional tools'],
      gradient: 'from-red-500 to-pink-500',
      icon: '🔥',
      status: 'Adobe Creative Cloud',
    },
  ],
  video: [
    {
      name: 'Runway Gen-2',
      developer: 'Runway',
      description: 'Text-to-video generation with high-quality outputs, motion control, and creative video editing tools.',
      features: ['Text-to-video', 'Image-to-video', 'Motion control', 'Video editing'],
      gradient: 'from-violet-500 to-purple-500',
      icon: '🎬',
      status: 'Subscription',
    },
    {
      name: 'Pika Labs',
      developer: 'Pika',
      description: 'AI video generation platform with intuitive controls and high-quality animated outputs.',
      features: ['Text-to-video', 'Image-to-video', 'Style transfer', 'Easy to use'],
      gradient: 'from-pink-500 to-rose-500',
      icon: '⚡',
      status: 'Beta',
    },
    {
      name: 'Stable Video Diffusion',
      developer: 'Stability AI',
      description: 'Open-source video generation model extending Stable Diffusion for temporal consistency.',
      features: ['Open-source', 'Image-to-video', 'Temporal consistency', 'Customizable'],
      gradient: 'from-blue-500 to-cyan-500',
      icon: '📹',
      status: 'Open Source',
    },
    {
      name: 'Sora',
      developer: 'OpenAI',
      description: 'Advanced text-to-video model capable of generating high-quality, realistic video scenes.',
      features: ['High quality', 'Realistic scenes', 'Long duration', 'Complex scenes'],
      gradient: 'from-green-500 to-emerald-500',
      icon: '🌊',
      status: 'Research Preview',
    },
  ],
  audio: [
    {
      name: 'ElevenLabs',
      developer: 'ElevenLabs',
      description: 'Advanced text-to-speech and voice cloning with natural, human-like voice synthesis.',
      features: ['Text-to-speech', 'Voice cloning', 'Multiple languages', 'Emotion control'],
      gradient: 'from-teal-500 to-cyan-500',
      icon: '🎙️',
      status: 'Subscription',
    },
    {
      name: 'Suno AI',
      developer: 'Suno',
      description: 'AI music generation platform that creates complete songs from text prompts.',
      features: ['Music generation', 'Lyrics creation', 'Multiple genres', 'Full songs'],
      gradient: 'from-yellow-500 to-orange-500',
      icon: '🎵',
      status: 'Free & Pro',
    },
    {
      name: 'Udio',
      developer: 'Udio',
      description: 'AI music creation tool for generating high-quality music tracks with customizable styles.',
      features: ['Music generation', 'Style control', 'High quality', 'Easy to use'],
      gradient: 'from-purple-500 to-pink-500',
      icon: '🎶',
      status: 'Beta',
    },
    {
      name: 'MusicGen',
      developer: 'Meta',
      description: 'Open-source music generation model for creating music from text descriptions.',
      features: ['Open-source', 'Text-to-music', 'Conditional generation', 'Research-focused'],
      gradient: 'from-indigo-500 to-blue-500',
      icon: '🎼',
      status: 'Open Source',
    },
  ],
  multimodal: [
    {
      name: 'GPT-4 Vision',
      developer: 'OpenAI',
      description: 'Multimodal model combining text and image understanding for complex visual reasoning tasks.',
      features: ['Image understanding', 'Text generation', 'Visual Q&A', 'Document analysis'],
      gradient: 'from-green-500 to-teal-500',
      icon: '👁️',
      status: 'Premium',
    },
    {
      name: 'Gemini Pro Vision',
      developer: 'Google',
      description: 'Multimodal AI with native understanding of text, images, audio, and video in a single model.',
      features: ['Native multimodal', 'Video understanding', 'Audio processing', 'Real-time capabilities'],
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🌐',
      status: 'Free & Pro',
    },
    {
      name: 'Claude 3 Opus',
      developer: 'Anthropic',
      description: 'Advanced multimodal model with exceptional vision capabilities and long-context understanding.',
      features: ['Vision capabilities', 'Long context', 'Document analysis', 'Safe & reliable'],
      gradient: 'from-purple-500 to-pink-500',
      icon: '🔮',
      status: 'Pro',
    },
  ],
}

const categories = [
  { id: 'text', name: 'Text Generation', icon: '📝', description: 'Language models for conversation, writing, and analysis' },
  { id: 'image', name: 'Image Generation', icon: '🖼️', description: 'AI models that create stunning images from text' },
  { id: 'video', name: 'Video Generation', icon: '🎥', description: 'Cutting-edge video creation from text and images' },
  { id: 'audio', name: 'Audio & Music', icon: '🎵', description: 'Voice synthesis and music generation models' },
  { id: 'multimodal', name: 'Multimodal AI', icon: '🌐', description: 'Models that understand multiple media types' },
]

export default function AIModelsPage() {
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
              AI Models Directory
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explore AI Models
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the most powerful AI models across text, image, video, audio, and multimodal capabilities
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="group px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="text-left">
                  <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-400">{category.description}</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Models by Category */}
        {categories.map((category) => {
          const models = aiModels[category.id as keyof typeof aiModels]
          return (
            <section key={category.id} id={category.id} className="mb-20 scroll-mt-32">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {category.name}
                    </h2>
                    <p className="text-gray-400 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model, index) => (
                  <div
                    key={index}
                    className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] relative overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${model.gradient}`} />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${model.gradient} rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                          {model.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {model.name}
                          </h3>
                          <p className="text-sm text-gray-400">{model.developer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {model.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-900/50 text-gray-300 text-xs rounded border border-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-xs text-gray-400">{model.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated on AI Models
            </h2>
            <p className="text-gray-300 mb-8">
              Get weekly insights on new AI models, updates, and breakthroughs in our newsletter
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














