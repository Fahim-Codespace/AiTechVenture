import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { saveNewsForDate, getTodayDateString, cleanupOldNews, NewsItem } from '@/lib/news-storage'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
})

// Trusted RSS sources for AI, tech, and business news
const RSS_FEEDS = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Tech Giants',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Tech Giants',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Tech Giants',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'AI Research',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/ai/feed/',
    category: 'AI News',
  },
  {
    name: 'Reuters Technology',
    url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
    category: 'Business Deals',
  },
]

// Keywords to filter relevant news
const RELEVANT_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'openai', 'google', 'microsoft', 'apple', 'meta', 'amazon', 'nvidia',
  'chatgpt', 'gpt', 'llm', 'model', 'launch', 'release',
  'acquisition', 'merger', 'deal', 'investment', 'funding',
  'startup', 'tech', 'technology', 'innovation',
  'sam altman', 'elon musk', 'sundar pichai', 'satya nadella',
]

function isRelevantNews(title: string, content: string): boolean {
  const searchText = (title + ' ' + content).toLowerCase()
  return RELEVANT_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()))
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
        .slice(0, 5) // Limit to 5 items per feed

      return items
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error)
      return []
    }
  })

  const results = await Promise.all(feedPromises)
  
  // Flatten and sort by date
  results.forEach(items => {
    allNews.push(...items)
  })

  // Sort by date (newest first)
  allNews.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })

  // Remove duplicates based on title similarity
  const uniqueNews: NewsItem[] = []
  const seenTitles = new Set<string>()
  
  for (const item of allNews) {
    const normalizedTitle = item.title.toLowerCase().trim()
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle)
      uniqueNews.push(item)
    }
  }

  // Limit to 30 most recent items
  return uniqueNews.slice(0, 30)
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

