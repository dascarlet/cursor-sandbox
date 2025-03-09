'use client';

import { useState } from 'react';
import ArticleList from './ArticleList';
import { Article as ArticleType } from '../types/article';
import { FaHome, FaNewspaper, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  onArticleSelect: (article: ArticleType | null) => void;
  onNavigate: (page: 'home' | 'articles') => void;
  currentPage: 'home' | 'articles';
}

export default function Sidebar({ onArticleSelect, onNavigate, currentPage }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">{t('common.markdownEditor')}</h1>
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
          aria-label={t(theme === 'dark' ? 'common.switchToLightMode' : 'common.switchToDarkMode')}
        >
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
      </div>

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
              <span>{t('common.home')}</span>
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
              <span>{t('common.articles')}</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <ArticleList onArticleSelect={onArticleSelect} onNavigate={onNavigate} />
    </div>
  );
} 