import type { Metadata, Viewport } from 'next'
import { Syne, Inter, JetBrains_Mono, Sarabun } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'rabbithole — Go deep. Stay deep.',
  description:
    'Your best work lives at the bottom. A deep work ritual app for people who take focus seriously. Early access: ฿29/month locked forever.',
  openGraph: {
    title: 'rabbithole — Early Access',
    description: 'Your best work lives at the bottom. A deep work ritual app for people who take focus seriously. Early access: ฿29/month locked forever.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rabbithole — Go deep. Stay deep.',
    description: 'Your best work lives at the bottom. A deep work ritual app for people who take focus seriously. Early access: ฿29/month locked forever.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#080612',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} ${sarabun.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
