'use client';

import { useState, useEffect } from 'react';
import { Todo as TodoType } from '../types/todo';
import Todo from './Todo';

const STORAGE_KEY = 'todos';

interface TodoListProps {
  onTodoSelect: (todo: TodoType | null) => void;
}

export default function TodoList({ onTodoSelect }: TodoListProps) {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos);
      // Convert stored date strings back to Date objects
      const todosWithDates = parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(todosWithDates);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const todo: TodoType = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      content: '',
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setNewTitle('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
      onTodoSelect(null);
    }
  };

  const handleTodoClick = (todo: TodoType) => {
    setSelectedTodo(todo);
    onTodoSelect(todo);
  };

  const updateContent = (content: string) => {
    if (!selectedTodo) return;
    const updatedTodo = { ...selectedTodo, content };
    setTodos(todos.map(todo =>
      todo.id === selectedTodo.id ? updatedTodo : todo
    ));
    setSelectedTodo(updatedTodo);
    onTodoSelect(updatedTodo);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Articles</h2>
      
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new article title..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
          >
            Add Article
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClick={() => handleTodoClick(todo)}
            isSelected={selectedTodo?.id === todo.id}
          />
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-4 text-sm">No articles yet. Add one above!</p>
      )}
    </div>
  );
} 