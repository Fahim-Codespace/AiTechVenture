export const metadata = {
  title: 'About | AiTechVenture',
  description: 'Learn about AiTechVenture: our mission, what we cover, and how we curate AI + technology resources.',
}

const values = [
  {
    title: 'Clarity over hype',
    description:
      'We focus on explainers, credible sources, and practical takeaways — not buzzwords.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Builders first',
    description:
      'Tools, workflows, and resources you can actually use to ship projects faster.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Responsible AI',
    description:
      'We highlight safety, ethics, and best practices as core parts of modern AI development.',
    gradient: 'from-emerald-500 to-green-500',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              About
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Building a Better AI + Tech Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AiTechVenture is a curated space for AI models, modern technologies, and weekly updates — designed to be useful,
            reliable, and easy to navigate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${v.gradient}`} />
              <h2 className="text-xl font-semibold text-white mb-2">{v.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">What you’ll find here</h2>
            <ul className="text-gray-300 space-y-2 list-disc pl-6">
              <li>AI model directory across text, image, video, audio, and multimodal.</li>
              <li>Curated news feed from trusted sources, prioritized for AI model launches and breakthroughs.</li>
              <li>A weekly newsletter built with an automated workflow for consistent delivery.</li>
              <li>A growing resources library for learning, tooling, and community.</li>
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Editorial approach</h2>
            <p className="text-gray-300 leading-relaxed">
              We aim to cite primary sources where possible (official blogs, research labs, reputable publications) and avoid
              reposting low-signal or misleading claims. If you spot an issue, please contact us — we’ll fix it quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

