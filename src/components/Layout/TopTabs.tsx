import React from 'react';
import { FileText, Users } from 'lucide-react';

interface TopTabsProps {
  activeTab: 'requests' | 'sitters';
  onTabChange: (tab: 'requests' | 'sitters') => void;
}

const TopTabs: React.FC<TopTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        <button
          onClick={() => onTabChange('requests')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-all duration-200 relative ${
            activeTab === 'requests'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">לוח בקשות</span>
          {activeTab === 'requests' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        
        <button
          onClick={() => onTabChange('sitters')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-all duration-200 relative ${
            activeTab === 'sitters'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">לוח סיטרים</span>
          {activeTab === 'sitters' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopTabs;