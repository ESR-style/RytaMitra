import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Weather from '../components/Weather';

const Agriculture = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'weather',
      title: t('agriculture.weather.title'),
      icon: '🌤️',
      description: t('agriculture.weather.description'),
      component: <Weather />
    },
    {
      id: 'flood',
      title: t('agriculture.flood.title'),
      icon: '🌊',
      description: t('agriculture.flood.description'),
      onClick: () => navigate('/alert')
    },
    {
      id: 'disease',
      title: t('agriculture.disease.title'),
      icon: '🔬',
      description: t('agriculture.disease.description'),
      onClick: () => navigate('/detection')
    },
    {
      id: 'irrigation',
      title: t('agriculture.irrigation.title'),
      icon: '💧',
      description: t('agriculture.irrigation.description'),
      onClick: () => navigate('/irrigation')
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t('agriculture.title')}</h1>

      {/* Weather Dashboard */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <Weather />
      </div>

      {/* Other Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.filter(section => section.id !== 'weather').map((section) => (
          <div
            key={section.id}
            onClick={section.onClick}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{section.icon}</span>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <p className="text-gray-600">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agriculture;
