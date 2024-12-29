"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? <>{children}</> : null
}

