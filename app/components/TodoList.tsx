'use client';

import { useState, useEffect } from 'react';
import { Todo as TodoType } from '../types/todo';
import Todo from './Todo';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'todos';
const STORAGE_KEY_PREFIX = 'todo_content_';
const SORT_ORDER_KEY = 'todos_sort_order';

// Helper function to safely access localStorage
const getStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

interface TodoListProps {
  onTodoSelect: (todo: TodoType | null) => void;
}

export default function TodoList({ onTodoSelect }: TodoListProps) {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    // Initialize sort order from localStorage or default to 'desc'
    return (getStorageItem(SORT_ORDER_KEY) as 'asc' | 'desc') || 'desc';
  });
  const { t } = useLanguage();

  // Sort todos based on timestamp
  const sortedTodos = [...todos].sort((a, b) => {
    const comparison = a.createdAt.getTime() - b.createdAt.getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle sort order and save to localStorage
  const toggleSortOrder = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      setStorageItem(SORT_ORDER_KEY, newOrder);
      return newOrder;
    });
  };

  // Load todos from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      // Load todos list
      const storedTodos = getStorageItem(STORAGE_KEY);
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        // Convert stored date strings back to Date objects and load content
        const todosWithDates = parsedTodos.map((todo: { id: string; title: string; createdAt: string }) => {
          // Load content for each todo
          const content = getStorageItem(STORAGE_KEY_PREFIX + todo.id) || '';
          return {
            ...todo,
            content,
            createdAt: new Date(todo.createdAt)
          };
        });

        // Set todos first
        setTodos(todosWithDates);

        // Then try to restore the selected todo
        const lastSelectedId = getStorageItem('lastSelectedTodoId');
        if (lastSelectedId) {
          const lastSelected = todosWithDates.find((todo: TodoType) => todo.id === lastSelectedId);
          if (lastSelected) {
            setSelectedTodo(lastSelected);
            onTodoSelect(lastSelected);
          }
        }
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      removeStorageItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      if (todos.length > 0) {
        // Save the todos list without content to avoid duplication
        const todosForStorage = todos.map(todo => ({
          id: todo.id,
          title: todo.title,
          createdAt: todo.createdAt,
          content: '' // Don't store content here as it's stored separately
        }));
        setStorageItem(STORAGE_KEY, JSON.stringify(todosForStorage));
      } else {
        // Clear all storage when no todos remain
        removeStorageItem(STORAGE_KEY);
        removeStorageItem('lastSelectedTodoId');
        // Clear all content items
        if (typeof window !== 'undefined') {
          const allKeys = Object.keys(localStorage);
          allKeys.forEach(key => {
            if (key.startsWith(STORAGE_KEY_PREFIX)) {
              removeStorageItem(key);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const todo: TodoType = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      content: '',
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setNewTitle('');
  };

  const deleteTodo = (id: string) => {
    removeStorageItem(STORAGE_KEY_PREFIX + id); // Remove the content when deleting todo
    if (id === getStorageItem('lastSelectedTodoId')) {
      removeStorageItem('lastSelectedTodoId');
    }
    setTodos(todos.filter(todo => todo.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
      onTodoSelect(null);
    }
  };

  const handleTodoClick = (todo: TodoType) => {
    // Load the latest content before setting the selected todo
    const content = getStorageItem(STORAGE_KEY_PREFIX + todo.id) || todo.content;
    const updatedTodo = { ...todo, content };
    setSelectedTodo(updatedTodo);
    onTodoSelect(updatedTodo);
    // Save the selected todo ID
    setStorageItem('lastSelectedTodoId', todo.id);
  };

  const updateContent = (content: string) => {
    if (!selectedTodo) return;
    const updatedTodo = { ...selectedTodo, content };
    setTodos(todos.map(todo =>
      todo.id === selectedTodo.id ? updatedTodo : todo
    ));
    setStorageItem(STORAGE_KEY_PREFIX + selectedTodo.id, content);
    setSelectedTodo(updatedTodo);
    onTodoSelect(updatedTodo);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('common.articles')}</h2>
        <button
          onClick={toggleSortOrder}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={t(sortOrder === 'asc' ? 'common.sortByNewest' : 'common.sortByOldest')}
        >
          {sortOrder === 'asc' ? <FaSortAmountUp size={16} /> : <FaSortAmountDown size={16} />}
        </button>
      </div>
      
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t('common.addArticleTitle')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
          >
            {t('common.addArticle')}
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-center text-gray-500 mt-4 text-sm">{t('common.loading')}</p>
      ) : (
        <>
          <div className="space-y-2">
            {sortedTodos.map(todo => (
              <Todo
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onClick={() => handleTodoClick(todo)}
                isSelected={selectedTodo?.id === todo.id}
              />
            ))}
          </div>

          {todos.length === 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm">{t('common.noArticles')}</p>
          )}
        </>
      )}
    </div>
  );
} 