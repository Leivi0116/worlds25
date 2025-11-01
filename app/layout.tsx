import type React from "react"
import type { Metadata } from "next"
import { Anton, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const anton = Anton({ subsets: ["latin"], weight: "400" })
const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Worlds 2025 Ticketing",
  description: "League of Legends Worlds 2025 Championship Finals Ticketing",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
