import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "People's Choice Awards | Vermont Maple Festival",
  description: "Vote for your favorites in the Vermont Maple Festival People's Choice Awards",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="maple-bg min-h-screen">
        {children}
      </body>
    </html>
  )
}
