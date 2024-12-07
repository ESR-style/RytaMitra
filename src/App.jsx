import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import useVoiceCommands from './hooks/useVoiceCommands';

const App = () => {
  const { isListening, toggleListening } = useVoiceCommands();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar isCollapsed={isCollapsed} />
          <main className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${
            isCollapsed ? 'ml-20' : 'ml-72'
          }`}>
            <Outlet />
          </main>
          <button
            onClick={toggleListening}
            className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-colors duration-200 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isListening ? '🎤 ನಿಲ್ಲಿಸು' : '🎤 ಪ್ರಾರಂಭಿಸು'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
