import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface FloatingActionButtonProps {
  activeTab: 'requests' | 'sitters';
  onAction: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ activeTab, onAction }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) return null;

  const isClientOnRequests = activeTab === 'requests' && userType === 'client';
  const isSitterOnSitters = activeTab === 'sitters' && userType === 'sitter';

  if (!isClientOnRequests && !isSitterOnSitters) return null;

  return (
    <button
      onClick={onAction}
      className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 border-2 border-white"
    >
      {isClientOnRequests ? (
        <Plus className="w-7 h-7" />
      ) : (
        <Clock className="w-7 h-7" />
      )}
    </button>
  );
};

export default FloatingActionButton;