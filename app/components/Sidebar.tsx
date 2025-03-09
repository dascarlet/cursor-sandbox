'use client';

import TodoList from './TodoList';

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg p-4 overflow-y-auto">
      <TodoList />
    </div>
  );
} 