import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PageTitle() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === 'en' ? 'Markdown Editor' : 'マークダウン エディター';
  }, [language]);

  return null;
} 