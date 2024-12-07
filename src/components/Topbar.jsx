import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' }
];

const Topbar = ({ isCollapsed }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={`fixed top-0 right-0 bg-white shadow-md p-4 z-10 transition-all duration-300`} 
         style={{ left: isCollapsed ? '5rem' : '18rem' }}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-800">{t('topbar.appName')}</h1>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className="px-4 py-2 border rounded bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-2 focus:ring-emerald-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
