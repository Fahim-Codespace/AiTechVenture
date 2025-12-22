import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

// Revalidate this route's response at least once every 24 hours (in seconds)
// This ensures the news feed is refreshed daily in production.
export const revalidate = 60 * 60 * 24

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

export async function GET() {
  try {
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
    const limitedNews = uniqueNews.slice(0, 30)

    return NextResponse.json({ news: limitedNews }, { status: 200 })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news', news: [] },
      { status: 500 }
    )
  }
}


