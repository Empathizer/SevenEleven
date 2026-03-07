import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "EsellerStore - Your Multi-Vendor Marketplace",
  description: "Shop millions of products from trusted sellers. Fashion, beauty, electronics, and more at amazing prices.",
  metadataBase: new URL('https://www.esellerstore.shop'),
  openGraph: {
    title: "EsellerStore - Your Multi-Vendor Marketplace",
    description: "Shop millions of products from trusted sellers. Fashion, beauty, electronics, and more at amazing prices.",
    url: 'https://www.esellerstore.shop',
    siteName: 'EsellerStore',
    images: ['/favicon.ico'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "EsellerStore - Your Multi-Vendor Marketplace",
    description: "Shop millions of products from trusted sellers. Fashion, beauty, electronics, and more at amazing prices.",
    images: ['/favicon.ico'],
  },
}

export const viewport: Viewport = {
  themeColor: "#F57224",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
