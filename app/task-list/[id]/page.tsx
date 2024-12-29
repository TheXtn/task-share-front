"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Share2, Trash2, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '@/services/api'
import { TaskList, Task } from '@/types'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TaskListPage({ params }: { params: { id: string } }) {
  const [taskList, setTaskList] = useState<TaskList | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [shareUsername, setShareUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const resolvedParams = use(params)

  useEffect(() => {
    fetchTaskList()
  }, [resolvedParams.id])

  const fetchTaskList = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate token before making the request
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const { data } = await api.getTaskList(parseInt(resolvedParams.id))
      setTaskList(data)
    } catch (error) {
      console.error('Failed to fetch task list:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch task list. Please try again later.')
      
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim() && taskList && !isSubmitting) {
      try {
        setIsSubmitting(true)
        setError(null)
        const { data } = await api.createTask(taskList.id, newTaskTitle)
        setTaskList(prevTaskList => ({
          ...prevTaskList!,
          tasks: [...(prevTaskList?.tasks || []), data]
        }))
        setNewTaskTitle('')
      } catch (error) {
        console.error('Failed to add task:', error)
        setError(error instanceof Error ? error.message : 'Failed to add task. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleToggleTask = async (task: Task) => {
    if (taskList && !isSubmitting) {
      try {
        setIsSubmitting(true)
        setError(null)
        const { data } = await api.updateTask(task.id, { completed: !task.completed })
        setTaskList(prevTaskList => ({
          ...prevTaskList!,
          tasks: prevTaskList!.tasks.map(t => t.id === task.id ? data : t)
        }))
      } catch (error) {
        console.error('Failed to update task:', error)
        setError(error instanceof Error ? error.message : 'Failed to update task. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (taskList && !isSubmitting) {
      try {
        setIsSubmitting(true)
        setError(null)
        await api.deleteTask(taskId)
        setTaskList(prevTaskList => ({
          ...prevTaskList!,
          tasks: prevTaskList!.tasks.filter(t => t.id !== taskId)
        }))
      } catch (error) {
        console.error('Failed to delete task:', error)
        setError(error instanceof Error ? error.message : 'Failed to delete task. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleShareList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (taskList && shareUsername && !isSubmitting) {
      try {
        setIsSubmitting(true)
        setError(null)
        await api.shareTaskList(taskList.id, shareUsername, 'view')
        setShareUsername('')
      } catch (error) {
        console.error('Failed to share task list:', error)
        setError(error instanceof Error ? error.message : 'Failed to share task list. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading task list...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  onClick={fetchTaskList} 
                  className="mt-4"
                  disabled={isSubmitting}
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          ) : taskList ? (
            <Card>
              <CardHeader>
                <CardTitle>{taskList.name}</CardTitle>
                <CardDescription>Manage your tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTask} className="mb-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="New task"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-grow"
                      disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      Add Task
                    </Button>
                  </div>
                </form>
                {taskList.tasks && taskList.tasks.length > 0 ? (
                  <ul className="space-y-2">
                    {taskList.tasks.map((task) => (
                      <li key={task.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task)}
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks yet. Add a task to get started!</p>
                )}
              </CardContent>
              <CardFooter>
                <form onSubmit={handleShareList} className="w-full">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Username to share with"
                      value={shareUsername}
                      onChange={(e) => setShareUsername(e.target.value)}
                      className="flex-grow"
                      disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      Share List
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                This task list could not be found.
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')} 
                  className="mt-4"
                >
                  Return to Dashboard
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

