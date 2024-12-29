"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from 'lucide-react'
import { api } from '@/services/api'
import { TaskList } from '@/types'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function Dashboard() {
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [newListName, setNewListName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTaskLists()
  }, [])

  const fetchTaskLists = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.getTaskLists()
      setTaskLists(data)
    } catch (error) {
      console.error('Failed to fetch task lists:', error)
      setError('Failed to fetch task lists. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newListName.trim()) {
      try {
        setError(null)
        const { data } = await api.createTaskList(newListName)
        setTaskLists(prevLists => [...prevLists, data])
        setNewListName('')
      } catch (error) {
        console.error('Failed to create task list:', error)
        setError('Failed to create task list. Please try again.')
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Task Lists</h1>
          <form onSubmit={handleCreateList} className="mb-8">
            <div className="flex space-x-2">
              <Input
                placeholder="New list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Create List
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <p>Loading task lists...</p>
          ) : taskLists.length === 0 ? (
            <p>You dont have any task lists yet. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taskLists.map((list) => (
                <Card key={list.id}>
                  <CardHeader>
                    <CardTitle>{list.name}</CardTitle>
                    <CardDescription>{list.tasks?.length || 0} tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Task list preview could go here */}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/task-list/${list.id}`}>View List</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

