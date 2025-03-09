'use client';

import { useState } from 'react';
import TodoList from './TodoList';
import { Todo as TodoType } from '../types/todo';
import { FaHome, FaNewspaper } from 'react-icons/fa';

interface SidebarProps {
  onTodoSelect: (todo: TodoType | null) => void;
  onNavigate: (page: 'home' | 'articles') => void;
  currentPage: 'home' | 'articles';
}

export default function Sidebar({ onTodoSelect, onNavigate, currentPage }: SidebarProps) {
  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg p-4 overflow-y-auto">
      <nav className="mb-8">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onNavigate('home')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaHome />
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('articles')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'articles'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaNewspaper />
              <span>Articles</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {currentPage === 'articles' && <TodoList onTodoSelect={onTodoSelect} />}
    </div>
  );
} 