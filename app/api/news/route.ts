import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { 
  getNewsForDate, 
  saveNewsForDate, 
  getTodayDateString,
  getNewsForLastDays,
  NewsItem as StorageNewsItem 
} from '@/lib/news-storage'

// Revalidate this route's response at least once every 6 hours (in seconds)
// This ensures the news feed is refreshed multiple times per day.
export const revalidate = 60 * 60 * 6

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

interface NewsItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  content?: string
  image?: string
  source: string
  category: string
}

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

async function fetchFreshNews(): Promise<NewsItem[]> {
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

export async function GET() {
  try {
    const today = getTodayDateString()
    
    // Get news from the last 7 days to ensure previous news stays stored
    let news = await getNewsForLastDays(7)
    
    // Check if we have fresh news for today
    const todayNews = await getNewsForDate(today)
    const hasTodayNews = todayNews && todayNews.length > 0
    
    // Determine if we need to refresh
    // Refresh if: no news for today, or news is older than 6 hours, or very few items
    let needsRefresh = false
    if (!hasTodayNews) {
      needsRefresh = true
      console.log('No saved news for today, will refresh...')
    } else if (todayNews.length < 10) {
      // If we have very few items, refresh to get more
      needsRefresh = true
      console.log(`Only ${todayNews.length} items for today, will refresh to get more...`)
    } else {
      // Check if today's news is stale (older than 6 hours)
      const now = new Date()
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)
      const latestNewsDate = todayNews.length > 0 
        ? new Date(todayNews[0].pubDate)
        : null
      
      if (!latestNewsDate || latestNewsDate < sixHoursAgo) {
        needsRefresh = true
        console.log('Today\'s news is stale (older than 6 hours), will refresh...')
      }
    }
    
    // If refresh is needed, fetch fresh news in the background
    if (needsRefresh) {
      // Fetch fresh news asynchronously (don't block the response)
      fetchFreshNews()
        .then(freshNews => {
          // Save today's news
          return saveNewsForDate(freshNews, today)
        })
        .then(() => {
          console.log(`Fresh news saved for ${today}`)
        })
        .catch(error => {
          console.error('Error fetching/saving fresh news (non-blocking):', error)
        })
    }
    
    // If we have news from last 7 days, return it
    if (news && news.length > 0) {
      console.log(`Serving news from last 7 days: ${news.length} items`)
      return NextResponse.json({ news }, { status: 200 })
    }
    
    // If no stored news, try to fetch fresh news synchronously
    console.log('No stored news found, fetching fresh news...')
    news = await fetchFreshNews()
    
    // Save the fetched news
    await saveNewsForDate(news, today)
    
    return NextResponse.json({ news: news || [] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching news:', error)
    
    // Fallback: try to get any saved news from last 7 days
    try {
      const savedNews = await getNewsForLastDays(7)
      if (savedNews && savedNews.length > 0) {
        return NextResponse.json({ news: savedNews }, { status: 200 })
      }
    } catch (fallbackError) {
      console.error('Fallback to saved news also failed:', fallbackError)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch news', news: [] },
      { status: 500 }
    )
  }
}


