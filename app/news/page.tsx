import Link from 'next/link'

const newsItems = [
  {
    title: 'Breakthrough in Multimodal AI',
    excerpt: 'New models can now process text, images, and audio simultaneously, opening doors to more intuitive AI interactions.',
    category: 'AI Research',
    date: '2024',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Quantum AI Accelerates Drug Discovery',
    excerpt: 'Researchers combine quantum computing with AI to dramatically speed up pharmaceutical research.',
    category: 'Healthcare AI',
    date: '2024',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Edge AI Reaches New Milestones',
    excerpt: 'Latest chips enable complex AI models to run on smartphones and IoT devices with unprecedented efficiency.',
    category: 'Hardware',
    date: '2024',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'AI Ethics Framework Adopted Globally',
    excerpt: 'Major tech companies agree on new standards for responsible AI development and deployment.',
    category: 'AI Ethics',
    date: '2024',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Generative AI Transforms Creative Industries',
    excerpt: 'Artists and creators are leveraging AI tools to push creative boundaries in unprecedented ways.',
    category: 'Creative AI',
    date: '2024',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Autonomous Systems Advance in Real-World Applications',
    excerpt: 'Self-driving vehicles and robots demonstrate improved safety and reliability in complex environments.',
    category: 'Robotics',
    date: '2024',
    gradient: 'from-red-500 to-rose-500',
  },
]

export default function NewsPage() {
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
            Stay informed with the latest developments in AI and technology
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <article
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105 group"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${item.gradient} rounded-t-lg mb-4`}></div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 bg-gradient-to-r ${item.gradient} text-white text-xs font-medium rounded-full`}>
                  {item.category}
                </span>
                <span className="text-gray-500 text-xs">{item.date}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {item.excerpt}
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
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

