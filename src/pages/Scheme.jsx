import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schemes } from '../data/schemes';

const Scheme = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('kannada');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Language Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {selectedLanguage === 'kannada' ? 'ಕೃಷಿ ಯೋಜನೆಗಳು' : 'Agricultural Schemes'}
          </h1>
          <button 
            onClick={() => setSelectedLanguage(selectedLanguage === 'kannada' ? 'english' : 'kannada')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {selectedLanguage === 'kannada' ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ'}
          </button>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div 
              key={scheme.id}
              onClick={() => navigate(`/scheme/${scheme.id}`)}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{scheme.icon}</div>
              <h2 className="text-xl font-bold mb-2">
                {scheme.title[selectedLanguage]}
              </h2>
              <p className="text-gray-600">
                {scheme.shortDescription[selectedLanguage]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scheme;


