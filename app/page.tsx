import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TaskShare</h1>
          <p className="text-xl mb-8">Collaborate on tasks with ease. Create, share, and manage your to-do lists effortlessly.</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-4 text-center">
          <p>&copy; 2023 TaskShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

