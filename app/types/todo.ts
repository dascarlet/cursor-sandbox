export interface Todo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export type TodoInput = Omit<Todo, 'id' | 'createdAt'>; 