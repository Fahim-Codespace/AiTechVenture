import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { saveNewsForDate, getTodayDateString, cleanupOldNews, NewsItem } from '@/lib/news-storage'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
})

// Trusted RSS sources focused on AI models, innovations, and technology
const RSS_FEEDS = [
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/ai/feed/',
    category: 'AI Innovations',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'AI Research',
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    category: 'AI Innovations',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    category: 'AI Technology',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Tech Innovations',
  },
  {
    name: 'IEEE Spectrum AI',
    url: 'https://spectrum.ieee.org/rss/blog/artificial-intelligence/fulltext',
    category: 'AI Research',
  },
  {
    name: 'Google AI Blog',
    url: 'https://ai.googleblog.com/feeds/posts/default',
    category: 'AI Models',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'AI Models',
  },
  {
    name: 'Anthropic Blog',
    url: 'https://www.anthropic.com/news/rss',
    category: 'AI Models',
  },
]

// Priority keywords for AI models and innovations (high priority)
const HIGH_PRIORITY_KEYWORDS = [
  // AI Models & LLMs
  'ai model', 'llm', 'large language model', 'gpt-', 'gpt', 'chatgpt', 'claude', 'gemini',
  'gpt-4', 'gpt-3', 'gpt-5', 'claude 3', 'claude 4', 'gemini pro', 'gemini ultra',
  'llama', 'mistral', 'mixtral', 'falcon', 'palm', 'bard', 'copilot',
  'transformer', 'neural network', 'deep learning', 'machine learning model',
  
  // Major AI Companies & Labs
  'openai', 'anthropic', 'google ai', 'deepmind', 'meta ai', 'microsoft ai',
  'xai', 'inflection ai', 'cohere', 'ai21 labs', 'hugging face',
  
  // Model Launches & Releases
  'model launch', 'model release', 'new model', 'announces', 'unveils', 'introduces',
  'ai breakthrough', 'ai innovation', 'breakthrough', 'milestone',
  
  // AI Technologies & Techniques
  'multimodal', 'computer vision', 'nlp', 'natural language processing',
  'reinforcement learning', 'generative ai', 'diffusion model', 'stable diffusion',
  'dall-e', 'midjourney', 'sora', 'video generation', 'image generation',
  'agent', 'autonomous agent', 'ai agent', 'reasoning', 'chain of thought',
  
  // Research & Development
  'ai research', 'paper', 'arxiv', 'ai technology', 'ai advancement',
  'benchmark', 'performance', 'capability', 'improvement',
]

// Secondary keywords for general AI and tech news
const SECONDARY_KEYWORDS = [
  'artificial intelligence', 'ai', 'machine learning', 'deep learning',
  'nvidia', 'amd', 'ai chip', 'gpu', 'ai hardware',
  'ai startup', 'ai company', 'ai investment', 'ai funding',
  'robotics', 'autonomous', 'self-driving', 'ai ethics',
  'tech innovation', 'technology breakthrough', 'innovation',
]

function isRelevantNews(title: string, content: string): boolean {
  const searchText = (title + ' ' + content).toLowerCase()
  
  // Check high priority keywords first (AI models, innovations)
  const hasHighPriority = HIGH_PRIORITY_KEYWORDS.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  )
  
  // Also check secondary keywords
  const hasSecondary = SECONDARY_KEYWORDS.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  )
  
  return hasHighPriority || hasSecondary
}

// Score news items to prioritize AI models and innovations
function scoreNewsItem(title: string, content: string): number {
  const searchText = (title + ' ' + content).toLowerCase()
  let score = 0
  
  // High priority keywords get more points
  HIGH_PRIORITY_KEYWORDS.forEach(keyword => {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 3
    }
  })
  
  // Secondary keywords get fewer points
  SECONDARY_KEYWORDS.forEach(keyword => {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 1
    }
  })
  
  return score
}

function extractImage(item: any): string | undefined {
  // Try different image sources
  if (item['media:content']?.[0]?.['$']?.url) {
    return item['media:content'][0]['$'].url
  }
  if (item['media:thumbnail']?.[0]?.['$']?.url) {
    return item['media:thumbnail'][0]['$'].url
  }
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url
  }
  if (item.content) {
    // Try to extract image from HTML content
    const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/i)
    if (imgMatch) {
      return imgMatch[1]
    }
  }
  return undefined
}

async function fetchAndProcessNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = []

  // Fetch news from all RSS feeds in parallel
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url)
      
      const items = parsed.items
        .filter(item => item.title && item.link)
        .map((item: any) => {
          const newsItem: NewsItem = {
            title: item.title || '',
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            contentSnippet: item.contentSnippet || item.content?.substring(0, 200) || '',
            content: item.content,
            image: extractImage(item),
            source: feed.name,
            category: feed.category,
          }
          return newsItem
        })
        .filter(item => 
          isRelevantNews(item.title, item.contentSnippet + ' ' + (item.content || ''))
        )
        .slice(0, 10) // Increase limit to get more items per feed

      return items
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error)
      return []
    }
  })

  const results = await Promise.all(feedPromises)
  
  // Flatten and add scoring
  results.forEach(items => {
    allNews.push(...items)
  })

  // Score and sort by relevance (score) first, then by date
  const scoredNews = allNews.map(item => ({
    item,
    score: scoreNewsItem(item.title, item.contentSnippet + ' ' + (item.content || '')),
    date: new Date(item.pubDate).getTime(),
  }))

  // Sort by score (descending) then by date (newest first)
  scoredNews.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score // Higher score first
    }
    return b.date - a.date // Newer first
  })

  // Remove duplicates based on link (more reliable than title)
  const uniqueNews: NewsItem[] = []
  const seenLinks = new Set<string>()
  
  for (const { item } of scoredNews) {
    if (!seenLinks.has(item.link)) {
      seenLinks.add(item.link)
      uniqueNews.push(item)
    }
  }

  // Return top 50 items (prioritized by AI model/innovation relevance)
  return uniqueNews.slice(0, 50)
}

// This endpoint will be called by Vercel Cron at 12 AM daily
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron or has proper authentication
    const url = new URL(request.url)
    const cronSecret = url.searchParams.get('secret')
    const authHeader = request.headers.get('authorization')
    const vercelCronHeader = request.headers.get('x-vercel-cron')
    
    // Allow if: Vercel cron header exists, OR secret query param matches, OR auth header matches
    const isAuthorized = 
      vercelCronHeader === '1' || 
      (process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET) ||
      (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`)
    
    // Only require auth if CRON_SECRET is set (optional security)
    if (process.env.CRON_SECRET && !isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting scheduled news refresh at', new Date().toISOString())
    
    // Fetch fresh news
    const news = await fetchAndProcessNews()
    
    // Save to file storage
    const today = getTodayDateString()
    await saveNewsForDate(news, today)
    
    // Clean up old news (keep last 30 days)
    await cleanupOldNews(30)
    
    console.log(`News refresh completed: ${news.length} items saved for ${today}`)
    
    return NextResponse.json({
      success: true,
      date: today,
      itemsSaved: news.length,
      message: 'News refreshed successfully',
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { 
        error: 'Failed to refresh news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

