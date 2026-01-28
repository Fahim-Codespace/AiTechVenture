import Link from 'next/link'

export const metadata = {
  title: 'Resources | AiTechVenture',
  description: 'Curated resources for AI builders: learning paths, tools, communities, and datasets.',
}

type Resource = {
  title: string
  description: string
  href: string
  tag: string
  gradient: string
}

const sections: { title: string; subtitle: string; items: Resource[] }[] = [
  {
    title: 'Learn',
    subtitle: 'High-signal learning resources to build real skills.',
    items: [
      {
        title: 'Deep Learning Specialization',
        description: 'A structured path for neural nets and practical ML foundations.',
        href: 'https://www.coursera.org/specializations/deep-learning',
        tag: 'Course',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Stanford CS229 (Machine Learning)',
        description: 'Classic ML lecture notes and materials.',
        href: 'https://cs229.stanford.edu/',
        tag: 'University',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        title: 'Hugging Face Course',
        description: 'Transformers + modern NLP with hands-on practice.',
        href: 'https://huggingface.co/learn',
        tag: 'Hands-on',
        gradient: 'from-emerald-500 to-green-500',
      },
    ],
  },
  {
    title: 'Build',
    subtitle: 'Tools and platforms that speed up prototyping and shipping.',
    items: [
      {
        title: 'Hugging Face',
        description: 'Models, datasets, inference, and open-source tooling.',
        href: 'https://huggingface.co/',
        tag: 'Platform',
        gradient: 'from-cyan-500 to-blue-500',
      },
      {
        title: 'LangChain',
        description: 'Framework for LLM apps, agents, and retrieval pipelines.',
        href: 'https://www.langchain.com/',
        tag: 'Framework',
        gradient: 'from-indigo-500 to-purple-500',
      },
      {
        title: 'Vercel AI SDK',
        description: 'Production-friendly streaming UX for AI apps.',
        href: 'https://sdk.vercel.ai/',
        tag: 'SDK',
        gradient: 'from-amber-500 to-orange-500',
      },
    ],
  },
  {
    title: 'Research',
    subtitle: 'Stay grounded in primary sources and benchmarks.',
    items: [
      {
        title: 'arXiv',
        description: 'Preprints for AI/ML and related fields.',
        href: 'https://arxiv.org/',
        tag: 'Papers',
        gradient: 'from-blue-500 to-purple-500',
      },
      {
        title: 'Papers With Code',
        description: 'Benchmarks + implementations in one place.',
        href: 'https://paperswithcode.com/',
        tag: 'Benchmarks',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        title: 'Google DeepMind Blog',
        description: 'Updates and research from DeepMind.',
        href: 'https://deepmind.google/discover/blog/',
        tag: 'Lab',
        gradient: 'from-emerald-500 to-teal-500',
      },
    ],
  },
  {
    title: 'Community',
    subtitle: 'Where builders share ideas, demos, and best practices.',
    items: [
      {
        title: 'OpenAI Developer Forum',
        description: 'Questions, tips, and community patterns around OpenAI APIs.',
        href: 'https://community.openai.com/',
        tag: 'Forum',
        gradient: 'from-green-500 to-emerald-500',
      },
      {
        title: 'Hugging Face Forums',
        description: 'Model releases, fine-tuning help, and community tooling.',
        href: 'https://discuss.huggingface.co/',
        tag: 'Forum',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        title: 'r/MachineLearning',
        description: 'Community discussion around new papers and tools.',
        href: 'https://www.reddit.com/r/MachineLearning/',
        tag: 'Community',
        gradient: 'from-cyan-500 to-blue-500',
      },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Resources
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Curated AI & Tech Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A high-signal library for learning, building, and staying current — organized so you can find what you need fast.
          </p>
        </div>

        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h2>
                <p className="text-gray-400 mt-2">{section.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <span className="px-2 py-1 bg-gray-900/50 text-gray-300 text-xs rounded border border-gray-700">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    <div className="mt-4 text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                      Visit resource →
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">Want something added?</h2>
            <p className="text-gray-300 mb-8">
              Suggest a tool, dataset, newsletter, or learning path and we’ll review it for inclusion.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Suggest a Resource
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

