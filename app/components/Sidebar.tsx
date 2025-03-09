'use client';

import TodoList from './TodoList';
import { Todo as TodoType } from '../types/todo';

interface SidebarProps {
  onTodoSelect: (todo: TodoType | null) => void;
}

export default function Sidebar({ onTodoSelect }: SidebarProps) {
  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg p-4 overflow-y-auto">
      <TodoList onTodoSelect={onTodoSelect} />
    </div>
  );
} 