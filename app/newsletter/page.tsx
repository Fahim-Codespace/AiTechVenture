'use client'

import NewsletterForm from '@/components/NewsletterForm'

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Weekly Newsletter
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AInTECH Weekly Newsletter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay ahead of the curve with our weekly newsletter featuring the latest AI breakthroughs, 
            technological innovations, and curated news with stunning visuals.
          </p>
        </div>

        {/* Automation Showcase */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
          <div className="mb-4">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30 uppercase tracking-wide">
              Fully Automated with n8n
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Hands-off Production Powered by an n8n Workflow
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            From scheduled research powered by Gemini and Perplexity to smart image selection, HTML generation, 
            and Gmail delivery—the entire AinTECH Weekly cycle runs on an orchestrated n8n workflow. 
            The visual below showcases every step that keeps the newsletter accurate, visual, and always on time.
          </p>
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
            <img
              src="/images/n8n-workflow.jpg"
              alt="n8n automation workflow powering the AinTECH Weekly newsletter"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Newsletter Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Curated Content</h3>
            <p className="text-gray-400 text-sm">
              Hand-picked articles and news about the most important developments in AI and technology.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">News with Images</h3>
            <p className="text-gray-400 text-sm">
              Every newsletter includes carefully selected images to make the content more engaging and visual.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Weekly Delivery</h3>
            <p className="text-gray-400 text-sm">
              Get your weekly dose of AI and tech news delivered straight to your inbox every week.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Stay Ahead</h3>
            <p className="text-gray-400 text-sm">
              Be the first to know about groundbreaking innovations and industry trends.
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 text-center mb-6">
            Join our community and never miss an update
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  )
}

