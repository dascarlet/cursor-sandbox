'use client';

import { Todo as TodoType } from '../types/todo';
import { FaTrash } from 'react-icons/fa';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  isSelected: boolean;
}

export default function Todo({ todo, onToggle, onDelete, onClick, isSelected }: TodoProps) {
  return (
    <div 
      className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
        isSelected ? 'border-blue-500' : 'border-gray-100'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggle(todo.id);
          }}
          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
        />
        <span className={`text-gray-800 text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.title}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm"
        aria-label="Delete article"
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
} 