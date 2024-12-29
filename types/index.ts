export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface TaskList {
  id: number;
  name: string;
  user_id: number;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  task_list_id: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

