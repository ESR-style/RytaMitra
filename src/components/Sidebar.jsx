import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { path: '/', label: t('sidebar.dashboard'), icon: '🏠' },
    { path: '/charts', label: t('sidebar.charts'), icon: '📈' },
    { path: '/transaction', label: t('sidebar.transactions'), icon: '💸' },
    { path: '/loan', label: t('sidebar.loans'), icon: '🏦' }, // Changed from /loans to /loan
    { path: '/scheme', label: t('sidebar.schemes'), icon: '📋' }, // Changed from /schemes to /scheme
    {
      path: '/animals',
      label: t('sidebar.animals'),
      icon: '🐮',
      submenu: [
        { path: '/cow', label: t('sidebar.cow'), icon: '🐄' },
        { path: '/chicken', label: t('sidebar.chicken'), icon: '🐔' }
      ]
    }
  ];

  return (
    <div className={`bg-emerald-800 text-white min-h-screen ${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 shadow-lg`}>
      <div className="p-4 border-b border-emerald-700 flex items-center justify-between">
        {!isCollapsed && <span className="text-xl font-bold">{t('topbar.appName')}</span>}
        <button
          className="p-2 rounded-lg hover:bg-emerald-700 text-emerald-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-6 px-2">
        {menuItems.map((item) => (
          <div key={item.path} className="mb-2">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </NavLink>
            {!isCollapsed && item.submenu?.map((subItem) => (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                className={({ isActive }) =>
                  `flex items-center pl-12 py-2 rounded-lg mt-1 transition-colors ${
                    isActive ? 'bg-emerald-700/70 text-white' : 'text-emerald-100 hover:bg-emerald-700/30'
                  }`
                }
              >
                <span className="text-lg">{subItem.icon}</span>
                <span className="ml-3">{subItem.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
