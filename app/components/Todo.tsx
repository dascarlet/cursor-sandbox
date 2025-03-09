'use client';

import { Todo as TodoType } from '../types/todo';
import { FaTrash } from 'react-icons/fa';

interface TodoProps {
  todo: TodoType;
  onDelete: (id: string) => void;
  onClick: () => void;
  isSelected: boolean;
}

export default function Todo({ todo, onDelete, onClick, isSelected }: TodoProps) {
  return (
    <div 
      className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
        isSelected ? 'border-blue-500' : 'border-gray-100'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="text-gray-800 text-sm">
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