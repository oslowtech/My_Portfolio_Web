import type { Metadata } from 'next'
import { Space_Mono, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { TopBar } from '@/components/navigation/TopBar'
import { Providers } from '@/components/Providers'
import { ChatWidget } from '@/components/chat/ChatWidget'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pranjal Giri — Engineering Systems Console',
  description: 'AI & Robotics Engineer | Flight Software Builder | Rockets, UGVs, UAVs, Embedded Systems',
  keywords: ['aerospace', 'robotics', 'flight software', 'AI', 'machine learning', 'rockets', 'UAV', 'UGV', 'embedded systems'],
  authors: [{ name: 'Pranjal Giri' }],
  openGraph: {
    title: 'Pranjal Giri — Engineering Systems Console',
    description: 'AI & Robotics Engineer | Flight Software Builder',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceMono.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('pg_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-paper text-ink font-sans transition-colors duration-200">
        <Providers>
          <TopBar />
          <main>{children}</main>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
