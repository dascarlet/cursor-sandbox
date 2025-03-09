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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
        />
        <span className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        aria-label="Delete todo"
      >
        <FaTrash />
      </button>
    </div>
  );
} 