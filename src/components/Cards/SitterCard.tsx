import React from 'react';
import { Star, MapPin, Clock, Shield } from 'lucide-react';
import { Sitter, SERVICE_TYPES } from '../../types';

interface SitterCardProps {
  sitter: Sitter;
  onClick: () => void;
}

const SitterCard: React.FC<SitterCardProps> = ({ sitter, onClick }) => {
  const minPrice = Math.min(...sitter.services.map(s => s.price));
  const maxPrice = Math.max(...sitter.services.map(s => s.price));

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] mx-4 hover:border-blue-200"
    >
      <div className="flex gap-4">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={sitter.profileImage || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={sitter.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
          />
          {sitter.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-sm">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{sitter.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{sitter.neighborhoods.slice(0, 2).join(', ')}</span>
                {sitter.neighborhoods.length > 2 && <span>+{sitter.neighborhoods.length - 2}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-sm text-yellow-700">{sitter.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{sitter.reviewCount} ביקורות</p>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1 mb-3">
            {sitter.services.map((service) => (
              <span
                key={service.id}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
              >
                {SERVICE_TYPES[service.type]}
              </span>
            ))}
          </div>

          {/* Experience & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>ניסיון {sitter.experience}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-green-600 text-lg">
                ₪{minPrice}-{maxPrice}
              </span>
              <p className="text-xs text-gray-500">לשירות</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitterCard;