import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EsellerStore - Your Multi-Vendor Marketplace",
  description: "Shop millions of products from trusted sellers. Fashion, beauty, electronics, and more at amazing prices.",
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
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
