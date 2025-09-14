import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { FilterOptions, NEIGHBORHOODS, SERVICE_TYPES, DOG_SIZES } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  activeTab: 'requests' | 'sitters';
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  activeTab,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      neighborhoods: [],
      serviceTypes: [],
      priceRange: [0, 200],
      rating: 0,
      availability: '',
      dogSize: []
    };
    setFilters(resetFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            סינון ומיון
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Neighborhoods */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">שכונות</h3>
            <div className="grid grid-cols-2 gap-2">
              {NEIGHBORHOODS.map((neighborhood) => (
                <label key={neighborhood} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.neighborhoods.includes(neighborhood)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          neighborhoods: [...prev.neighborhoods, neighborhood]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          neighborhoods: prev.neighborhoods.filter(n => n !== neighborhood)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm hover:text-blue-600 transition-colors">{neighborhood}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Service Types */}
          <div>
            <h3 className="font-medium mb-3">סוג שירות</h3>
            <div className="space-y-2">
              {Object.entries(SERVICE_TYPES).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.serviceTypes.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          serviceTypes: [...prev.serviceTypes, key]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          serviceTypes: prev.serviceTypes.filter(s => s !== key)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">טווח מחירים</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }));
                  }}
                  className="flex-1"
                />
                <span className="text-sm font-medium">₪{filters.priceRange[1]}</span>
              </div>
              <div className="text-sm text-gray-600">
                עד ₪{filters.priceRange[1]} לשירות
              </div>
            </div>
          </div>

          {/* Rating (for sitters only) */}
          {activeTab === 'sitters' && (
            <div>
              <h3 className="font-medium mb-3">דירוג מינימלי</h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 0].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters(prev => ({ ...prev, rating }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {rating === 0 ? 'הכל' : `${rating}+ כוכבים`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Dog Size (for requests only) */}
          {activeTab === 'requests' && (
            <div>
              <h3 className="font-medium mb-3">גודל כלב</h3>
              <div className="space-y-2">
                {Object.entries(DOG_SIZES).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.dogSize.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            dogSize: [...prev.dogSize, key]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            dogSize: prev.dogSize.filter(s => s !== key)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            איפוס
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            החל סינון
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;