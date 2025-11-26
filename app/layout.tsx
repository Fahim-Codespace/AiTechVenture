import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SubscriptionModalProvider } from '@/components/SubscriptionModalContext'
import SubscriptionModal from '@/components/SubscriptionModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AiTechVenture - Exploring AI and Technologies',
  description: 'Discover the latest in AI and modern technologies. Stay updated with cutting-edge innovations and insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SubscriptionModalProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <SubscriptionModal />
        </SubscriptionModalProvider>
      </body>
    </html>
  )
}

