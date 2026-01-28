export const metadata = {
  title: 'Privacy Policy | AiTechVenture',
  description: 'Privacy policy for AiTechVenture.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Privacy
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-300">
            This is a simple privacy policy template. Update it to match your legal requirements and deployed services.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Newsletter subscriptions: name and email address (stored in your configured Google Sheet).</li>
              <li>Contact form messages: name, email, and message content (sent to your configured inbox).</li>
            </ul>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-white mb-2">How we use it</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To send the weekly newsletter (if you subscribe).</li>
              <li>To respond to your inquiries (if you contact us).</li>
              <li>To operate and improve the website.</li>
            </ul>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your choices</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can unsubscribe at any time via the unsubscribe page.</li>
              <li>You can request removal of your data by contacting us.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

