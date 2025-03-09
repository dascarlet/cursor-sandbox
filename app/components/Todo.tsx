'use client';

import { Todo as TodoType } from '../types/todo';
import { FaTrash } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

interface TodoProps {
  todo: TodoType;
  onDelete: (id: string) => void;
  onClick: () => void;
  isSelected: boolean;
}

// Format date to JST timestamp
const formatJSTDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

export default function Todo({ todo, onDelete, onClick, isSelected }: TodoProps) {
  const { t } = useLanguage();

  return (
    <div 
      className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
        isSelected ? 'border-blue-500' : 'border-gray-100'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <span className="text-gray-800 text-sm">
          {todo.title}
        </span>
        <span className="text-gray-400 text-xs font-mono">
          {formatJSTDate(todo.createdAt)}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm"
        aria-label={t('common.deleteArticle')}
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
} 