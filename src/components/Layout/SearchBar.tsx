import React, { useState } from 'react';
import { Search, Filter, User, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  searchQuery: string;
  onAuthClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter, searchQuery, onAuthClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Login Button (for non-authenticated users) */}
        {!isAuthenticated && (
          <button
            onClick={onAuthClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>התחבר</span>
          </button>
        )}

        {/* Profile Menu */}
        {isAuthenticated && (
          <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.userType === 'client' ? 'בעל כלב' : 'סיטר'}</p>
                  </div>
                  <button className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    פרופיל אישי
                  </button>
                  <button className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    הגדרות
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    התנתק
                  </button>
            </div>
          )}
          </div>
        )}

        {/* Filter Button */}
        <button
          onClick={onFilter}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חיפוש..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pr-4 pl-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;