import { promises as fs } from 'fs'
import path from 'path'

export interface NewsItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  content?: string
  image?: string
  source: string
  category: string
}

interface NewsArchive {
  date: string
  news: NewsItem[]
}

const NEWS_STORAGE_DIR = path.join(process.cwd(), 'data', 'news')

// Ensure the storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(NEWS_STORAGE_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating storage directory:', error)
  }
}

// Get today's date string in YYYY-MM-DD format
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// Get date string for a specific date
export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Save news for a specific date
export async function saveNewsForDate(news: NewsItem[], dateString?: string): Promise<void> {
  await ensureStorageDir()
  const date = dateString || getTodayDateString()
  const filePath = path.join(NEWS_STORAGE_DIR, `${date}.json`)
  
  const archive: NewsArchive = {
    date,
    news,
  }
  
  try {
    await fs.writeFile(filePath, JSON.stringify(archive, null, 2), 'utf-8')
    console.log(`News saved for ${date}: ${news.length} items`)
  } catch (error) {
    console.error(`Error saving news for ${date}:`, error)
    throw error
  }
}

// Get news for a specific date
export async function getNewsForDate(dateString: string): Promise<NewsItem[] | null> {
  await ensureStorageDir()
  const filePath = path.join(NEWS_STORAGE_DIR, `${dateString}.json`)
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const archive: NewsArchive = JSON.parse(fileContent)
    return archive.news
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null // File doesn't exist
    }
    console.error(`Error reading news for ${dateString}:`, error)
    return null
  }
}

// Get all archived news dates
export async function getAllArchivedDates(): Promise<string[]> {
  await ensureStorageDir()
  
  try {
    const files = await fs.readdir(NEWS_STORAGE_DIR)
    const dates = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
      .sort()
      .reverse() // Most recent first
    return dates
  } catch (error) {
    console.error('Error reading archived dates:', error)
    return []
  }
}

// Get news for the last N days
export async function getNewsForLastDays(days: number): Promise<NewsItem[]> {
  const allNews: NewsItem[] = []
  const dates = await getAllArchivedDates()
  const recentDates = dates.slice(0, days)
  
  for (const date of recentDates) {
    const news = await getNewsForDate(date)
    if (news) {
      allNews.push(...news)
    }
  }
  
  // Sort by date (newest first) and remove duplicates
  const uniqueNews: NewsItem[] = []
  const seenLinks = new Set<string>()
  
  allNews.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })
  
  for (const item of allNews) {
    if (!seenLinks.has(item.link)) {
      seenLinks.add(item.link)
      uniqueNews.push(item)
    }
  }
  
  return uniqueNews
}

// Clean up old news files (older than specified days)
export async function cleanupOldNews(keepDays: number = 30): Promise<void> {
  await ensureStorageDir()
  const dates = await getAllArchivedDates()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - keepDays)
  
  let deletedCount = 0
  
  for (const dateString of dates) {
    const fileDate = new Date(dateString)
    if (fileDate < cutoffDate) {
      try {
        const filePath = path.join(NEWS_STORAGE_DIR, `${dateString}.json`)
        await fs.unlink(filePath)
        deletedCount++
      } catch (error) {
        console.error(`Error deleting old news file ${dateString}:`, error)
      }
    }
  }
  
  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} old news files`)
  }
}

