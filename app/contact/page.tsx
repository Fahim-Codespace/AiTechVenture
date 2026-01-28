import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact | AiTechVenture',
  description: 'Get in touch with AiTechVenture. Send feedback, partnership inquiries, or questions.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Contact
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let’s Talk
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have feedback, a partnership idea, or want to suggest resources/news sources? Send a message below.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

