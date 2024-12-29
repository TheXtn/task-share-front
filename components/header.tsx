"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useUser } from '@/contexts/UserContext'

export function Header() {
  const router = useRouter()
  const { user, setUser } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TaskShare
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Profile</Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

