import { User, TaskList, Task, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;


async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    if (!data.user || !data.token) {
      throw new Error('Invalid response structure from server');
    }

    return data;
  },

  register: async (name: string, email: string, username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  getUser: async (): Promise<ApiResponse<User>> => {
    return fetchWithAuth('/user');
  },

  updateUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return fetchWithAuth('/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getTaskLists: async (): Promise<ApiResponse<TaskList[]>> => {
    return fetchWithAuth('/task-lists');
  },

  createTaskList: async (name: string): Promise<ApiResponse<TaskList>> => {
    return fetchWithAuth('/task-lists', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  getTaskList: async (id: number): Promise<ApiResponse<TaskList>> => {
    return fetchWithAuth(`/task-lists/${id}`);
  },

  updateTaskList: async (id: number, name: string): Promise<ApiResponse<TaskList>> => {
    return fetchWithAuth(`/task-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  deleteTaskList: async (id: number): Promise<ApiResponse<null>> => {
    return fetchWithAuth(`/task-lists/${id}`, {
      method: 'DELETE',
    });
  },

  createTask: async (taskListId: number, title: string, description?: string): Promise<ApiResponse<Task>> => {
    return fetchWithAuth(`/task-lists/${taskListId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  },

  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    return fetchWithAuth(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  deleteTask: async (taskId: number): Promise<ApiResponse<null>> => {
    return fetchWithAuth(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  shareTaskList: async (taskListId: number, username: string, permission: 'view' | 'edit'): Promise<ApiResponse<null>> => {
    return fetchWithAuth(`/task-lists/${taskListId}/share`, {
      method: 'POST',
      body: JSON.stringify({ username, permission }),
    });
  },
  getSharedTaskLists: async (): Promise<ApiResponse<TaskList[]>> => {
    return fetchWithAuth('/shared-lists');
  },
};

