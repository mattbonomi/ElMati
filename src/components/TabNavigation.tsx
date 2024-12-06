import React from 'react';
import { OrderStatus } from '../types/order';

interface TabNavigationProps {
  activeTab: OrderStatus;
  onTabChange: (tab: OrderStatus) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: OrderStatus[] = ['pendiente', 'en-proceso', 'completado', 'cancelado'];

  return (
    <nav className="flex space-x-4 mb-8" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-3 py-2 font-medium text-sm rounded-md ${
            activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
};