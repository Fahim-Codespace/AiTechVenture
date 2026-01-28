export const metadata = {
  title: 'Terms of Service | AiTechVenture',
  description: 'Terms of service for AiTechVenture.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Terms
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-300">
            This is a lightweight terms template. Update it to match your legal requirements.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Use of the site</h2>
            <p>
              You may use this website for personal and informational purposes. Do not abuse the service, attempt to
              disrupt availability, or use the site for unlawful activity.
            </p>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Content</h2>
            <p>
              AiTechVenture provides curated links and summaries for educational purposes. We do not guarantee accuracy
              of third-party sources and we are not responsible for external content.
            </p>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Newsletter</h2>
            <p>
              If you subscribe, you may receive periodic emails. You can unsubscribe at any time from the unsubscribe
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

