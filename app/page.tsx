'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Sidebar from './components/Sidebar';
import { Todo as TodoType } from './types/todo';

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Debounced save indicator
  useEffect(() => {
    if (selectedTodo) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedTodo?.content]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onTodoSelect={setSelectedTodo} />
      <main className="flex-1 ml-80 p-8">
        {selectedTodo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">{selectedTodo.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isSaving ? 'text-blue-500' : 'text-green-500'}`}>
                  {isSaving ? 'Saving...' : 'Saved'}
                </span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-600">Editor</h2>
                <textarea
                  className="w-full h-[calc(100vh-14rem)] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  placeholder="Write your article in markdown..."
                  value={selectedTodo.content}
                  onChange={(e) => setSelectedTodo({ ...selectedTodo, content: e.target.value })}
                />
              </div>
              
              {showPreview && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-gray-600">Preview</h2>
                  <div className="w-full h-[calc(100vh-14rem)] p-4 border border-gray-200 rounded-lg overflow-y-auto prose prose-sm max-w-none">
                    <ReactMarkdown>{selectedTodo.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
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
