'use client';

import { Todo as TodoType } from '../types/todo';
import { FaTrash } from 'react-icons/fa';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Todo({ todo, onToggle, onDelete }: TodoProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
        />
        <span className={`text-gray-800 text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm"
        aria-label="Delete todo"
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
} 