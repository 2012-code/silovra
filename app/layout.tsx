import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Silovra - Beautiful Link Pages for Creators',
  description: 'Create stunning, animated link pages. Share everything you do in one place.',
  keywords: 'link in bio, social media links, creator tools, link page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f766e',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
