export interface Todo {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoInput = Omit<Todo, 'id' | 'createdAt'>; 