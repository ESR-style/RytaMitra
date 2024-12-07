import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import useVoiceCommands from './hooks/useVoiceCommands';

const App = () => {
  const { isListening, toggleListening } = useVoiceCommands();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen relative">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <Topbar 
            isCollapsed={isCollapsed} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
          <main className={`flex-1 p-4 transition-all duration-300 
            md:pl-[${isCollapsed ? '5rem' : '18rem'}]
            w-full mt-16`}>
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
