'use client';

import { useState, useEffect } from 'react';
import { Article as ArticleType } from '../types/article';
import Article from './Article';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'articles';
const STORAGE_KEY_PREFIX = 'article_content_';
const STORAGE_KEY_TITLE_PREFIX = 'article_title_';
const SORT_ORDER_KEY = 'articles_sort_order';
const LAST_PAGE_KEY = 'lastPage';

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

interface ArticleListProps {
  onArticleSelect: (article: ArticleType | null) => void;
  onNavigate?: (page: 'home' | 'articles') => void;
}

export default function ArticleList({ onArticleSelect, onNavigate }: ArticleListProps) {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(SORT_ORDER_KEY) as 'asc' | 'desc') || 'desc';
    }
    return 'desc';
  });
  const { t } = useLanguage();

  // Sort articles based on timestamp
  const sortedArticles = [...articles].sort((a, b) => {
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

  // Load articles on client-side mount
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Load articles list
        const storedArticles = localStorage.getItem(STORAGE_KEY);
        if (storedArticles) {
          const parsedArticles = JSON.parse(storedArticles);
          // Convert stored date strings back to Date objects and load content
          const articlesWithDates = parsedArticles.map((article: { id: string; title: string; createdAt: string }) => {
            // Load content and title for each article
            const content = localStorage.getItem(STORAGE_KEY_PREFIX + article.id) || '';
            const title = localStorage.getItem(STORAGE_KEY_TITLE_PREFIX + article.id) || article.title;
            return {
              ...article,
              content,
              title,
              createdAt: new Date(article.createdAt)
            };
          });

          // Set articles first
          setArticles(articlesWithDates);

          // Then try to restore the selected article
          const lastSelectedId = localStorage.getItem('lastSelectedArticleId');
          if (lastSelectedId) {
            const lastSelected = articlesWithDates.find((article: ArticleType) => article.id === lastSelectedId);
            if (lastSelected) {
              // Ensure we have the latest content for the selected article
              const latestContent = localStorage.getItem(STORAGE_KEY_PREFIX + lastSelectedId) || lastSelected.content;
              const latestTitle = localStorage.getItem(STORAGE_KEY_TITLE_PREFIX + lastSelectedId) || lastSelected.title;
              const updatedLastSelected = {
                ...lastSelected,
                content: latestContent,
                title: latestTitle
              };
              setSelectedArticle(updatedLastSelected);
              onArticleSelect(updatedLastSelected);
              // Switch to articles page when an article is selected
              onNavigate?.('articles');
            }
          }
        }
      } catch (error) {
        console.error('Error loading articles:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        // Articles list was updated
        const storedArticles = getStorageItem(STORAGE_KEY);
        if (storedArticles) {
          const parsedArticles = JSON.parse(storedArticles);
          const articlesWithDates = parsedArticles.map((article: { id: string; title: string; createdAt: string }) => {
            const content = getStorageItem(STORAGE_KEY_PREFIX + article.id) || '';
            const title = getStorageItem(STORAGE_KEY_TITLE_PREFIX + article.id) || article.title;
            return {
              ...article,
              content,
              title,
              createdAt: new Date(article.createdAt)
            };
          });
          setArticles(articlesWithDates);

          // Update selected article if it exists in the new list
          if (selectedArticle) {
            const updatedSelected = articlesWithDates.find((article: ArticleType) => article.id === selectedArticle.id);
            if (updatedSelected) {
              setSelectedArticle(updatedSelected);
              onArticleSelect(updatedSelected);
            }
          }
        }
      } else if (e.key?.startsWith(STORAGE_KEY_PREFIX)) {
        // Content was updated
        const articleId = e.key.replace(STORAGE_KEY_PREFIX, '');
        const content = e.newValue || '';
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article.id === articleId 
              ? { ...article, content }
              : article
          )
        );
        if (selectedArticle?.id === articleId) {
          const updatedArticle = selectedArticle ? { ...selectedArticle, content } : null;
          setSelectedArticle(updatedArticle);
          onArticleSelect(updatedArticle);
        }
      } else if (e.key?.startsWith(STORAGE_KEY_TITLE_PREFIX)) {
        // Title was updated
        const articleId = e.key.replace(STORAGE_KEY_TITLE_PREFIX, '');
        const title = e.newValue || '';
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article.id === articleId 
              ? { ...article, title }
              : article
          )
        );
        if (selectedArticle?.id === articleId) {
          const updatedArticle = selectedArticle ? { ...selectedArticle, title } : null;
          setSelectedArticle(updatedArticle);
          onArticleSelect(updatedArticle);
        }
      }
    };

    const handleTitleUpdate = (e: CustomEvent<{ id: string; title: string }>) => {
      const { id, title } = e.detail;
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === id 
            ? { ...article, title }
            : article
        )
      );
      if (selectedArticle?.id === id) {
        const updatedArticle = selectedArticle ? { ...selectedArticle, title } : null;
        setSelectedArticle(updatedArticle);
        onArticleSelect(updatedArticle);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('articleTitleUpdate', handleTitleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('articleTitleUpdate', handleTitleUpdate as EventListener);
    };
  }, [selectedArticle]);

  // Save articles to localStorage whenever they change
  useEffect(() => {
    try {
      if (articles.length > 0) {
        // Save the articles list without content to avoid duplication
        const articlesForStorage = articles.map(article => ({
          id: article.id,
          title: article.title,
          createdAt: article.createdAt,
          content: '' // Don't store content here as it's stored separately
        }));
        setStorageItem(STORAGE_KEY, JSON.stringify(articlesForStorage));

        // Ensure content is saved for each article
        articles.forEach(article => {
          const currentContent = localStorage.getItem(STORAGE_KEY_PREFIX + article.id);
          if (currentContent !== article.content) {
            setStorageItem(STORAGE_KEY_PREFIX + article.id, article.content);
          }
          const currentTitle = localStorage.getItem(STORAGE_KEY_TITLE_PREFIX + article.id);
          if (currentTitle !== article.title) {
            setStorageItem(STORAGE_KEY_TITLE_PREFIX + article.id, article.title);
          }
        });
      } else {
        // Clear all storage when no articles remain
        removeStorageItem(STORAGE_KEY);
        removeStorageItem('lastSelectedArticleId');
        // Clear all content and title items
        if (typeof window !== 'undefined') {
          const allKeys = Object.keys(localStorage);
          allKeys.forEach(key => {
            if (key.startsWith(STORAGE_KEY_PREFIX) || key.startsWith(STORAGE_KEY_TITLE_PREFIX)) {
              removeStorageItem(key);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error saving articles:', error);
    }
  }, [articles]);

  const addArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const article: ArticleType = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      content: '',
      createdAt: new Date(),
    };

    setArticles([...articles, article]);
    setNewTitle('');
    // Set the new article as selected
    setSelectedArticle(article);
    onArticleSelect(article);
    setStorageItem('lastSelectedArticleId', article.id);
    setStorageItem(LAST_PAGE_KEY, 'articles');
    onNavigate?.('articles');
  };

  const deleteArticle = (id: string) => {
    // Remove the content and title when deleting article
    removeStorageItem(STORAGE_KEY_PREFIX + id);
    removeStorageItem(STORAGE_KEY_TITLE_PREFIX + id);
    
    // If this was the last selected article, clear the lastSelectedArticleId
    if (id === localStorage.getItem('lastSelectedArticleId')) {
      removeStorageItem('lastSelectedArticleId');
    }
    
    setArticles(articles.filter(article => article.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
      onArticleSelect(null);
    }
  };

  const handleArticleClick = (article: ArticleType) => {
    // Load the latest content before setting the selected article
    const content = localStorage.getItem(STORAGE_KEY_PREFIX + article.id) || article.content;
    const title = localStorage.getItem(STORAGE_KEY_TITLE_PREFIX + article.id) || article.title;
    const updatedArticle = { ...article, content, title };
    
    // Update the article in the articles list to ensure content is preserved
    setArticles(prevArticles => 
      prevArticles.map(a => 
        a.id === article.id ? updatedArticle : a
      )
    );
    
    setSelectedArticle(updatedArticle);
    onArticleSelect(updatedArticle);
    // Save the selected article ID
    setStorageItem('lastSelectedArticleId', article.id);
    // Save the current page
    setStorageItem(LAST_PAGE_KEY, 'articles');
    // Switch to articles page when an article is clicked
    onNavigate?.('articles');
  };

  const updateContent = (content: string) => {
    if (!selectedArticle) return;
    const updatedArticle = { ...selectedArticle, content };
    
    // Update both the articles list and selected article
    setArticles(articles.map(article =>
      article.id === selectedArticle.id ? updatedArticle : article
    ));
    
    // Save to localStorage
    setStorageItem(STORAGE_KEY_PREFIX + selectedArticle.id, content);
    setSelectedArticle(updatedArticle);
    onArticleSelect(updatedArticle);
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
      
      <form onSubmit={addArticle} className="mb-4">
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
            {sortedArticles.map(article => (
              <Article
                key={article.id}
                article={article}
                onDelete={deleteArticle}
                onClick={() => handleArticleClick(article)}
                isSelected={selectedArticle?.id === article.id}
              />
            ))}
          </div>

          {articles.length === 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm">{t('common.noArticles')}</p>
          )}
        </>
      )}
    </div>
  );
} 