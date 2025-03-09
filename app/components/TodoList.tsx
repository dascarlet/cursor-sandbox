'use client';

import { useState } from 'react';
import { Todo as TodoType } from '../types/todo';
import Todo from './Todo';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: TodoType = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Todo List</h1>
      
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No todos yet. Add one above!</p>
      )}
    </div>
  );
} 