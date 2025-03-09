'use client';

import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import { Todo as TodoType } from './types/todo';

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onTodoSelect={setSelectedTodo} />
      <main className="flex-1 ml-80 p-8">
        {selectedTodo ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{selectedTodo.title}</h1>
            <textarea
              className="w-full h-[calc(100vh-12rem)] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your article content here..."
              value={selectedTodo.content}
              onChange={(e) => setSelectedTodo({ ...selectedTodo, content: e.target.value })}
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Articles</h1>
            <p className="mt-4 text-gray-600">Select an article from the sidebar to start editing.</p>
          </div>
        )}
      </main>
    </div>
  );
}
