'use client';

import { FaMarkdown, FaClock, FaMoon, FaSort, FaLanguage } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

export default function TopPage() {
  const { t, language, setLanguage } = useLanguage();

  // Get the steps array from translations based on current language
  const steps = translations[language].topPage.gettingStarted.steps;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-center flex-grow">
          <h1 className="text-4xl font-bold text-gray-800">{t('topPage.welcome')}</h1>
          <p className="text-xl text-gray-600 mt-4">{t('topPage.subtitle')}</p>
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 flex items-center gap-2"
          aria-label="Switch language"
        >
          <FaLanguage size={20} />
          <span>{language === 'en' ? '日本語' : 'English'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<FaMarkdown className="w-8 h-8" />}
          title={t('topPage.features.markdownPreview.title')}
          description={t('topPage.features.markdownPreview.description')}
        />
        <FeatureCard
          icon={<FaClock className="w-8 h-8" />}
          title={t('topPage.features.timestamp.title')}
          description={t('topPage.features.timestamp.description')}
        />
        <FeatureCard
          icon={<FaMoon className="w-8 h-8" />}
          title={t('topPage.features.darkMode.title')}
          description={t('topPage.features.darkMode.description')}
        />
        <FeatureCard
          icon={<FaSort className="w-8 h-8" />}
          title={t('topPage.features.organization.title')}
          description={t('topPage.features.organization.description')}
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('topPage.gettingStarted.title')}</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
} 