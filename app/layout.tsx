import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "../components/theme-provider"
import { UserProvider } from '../contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskShare',
  description: 'Collaborate on tasks with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

