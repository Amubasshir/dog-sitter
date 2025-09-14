import React from 'react';
import { X, Star, MapPin, Clock, Shield, Phone, MessageCircle, Calendar } from 'lucide-react';
import { Sitter, SERVICE_TYPES } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SitterDetailsProps {
  sitter: Sitter;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  onBooking: () => void;
}

const SitterDetails: React.FC<SitterDetailsProps> = ({
  sitter,
  isOpen,
  onClose,
  onContact,
  onBooking
}) => {
  if (!isOpen) return null;

  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'מיכל הייתה מדהימה עם מקס! הכלב חזר עייף ומרוצה.',
      clientName: 'דני כהן',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      rating: 5,
      comment: 'מקצועית ואמינה. בהחלט נשתמש שוב בשירותיה.',
      clientName: 'שרה לוי',
      date: new Date('2024-01-10')
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold">פרטי סיטר</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-6 mb-6">
            <div className="relative">
              <img
                src={sitter.profileImage || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={sitter.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
              />
              {sitter.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-2 ring-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{sitter.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-yellow-700">{sitter.rating}</span>
                  <span className="text-yellow-600">({sitter.reviewCount} ביקורות)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>ניסיון {sitter.experience}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{sitter.neighborhoods.join(', ')}</span>
              </div>
            </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">אודות</h3>
            <p className="text-gray-700 leading-relaxed">{sitter.description}</p>
          </div>

          {/* Services & Prices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">שירותים ומחירים</h3>
            <div className="grid gap-3">
              {sitter.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{SERVICE_TYPES[service.type]}</span>
                  <span className="font-semibold text-green-600">₪{service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">זמינות</h3>
            <div className="grid grid-cols-1 gap-2">
              {sitter.availability.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="font-medium">{slot.day}</span>
                  <span className="text-green-700">{slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">ביקורות</h3>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{review.clientName}</span>
                    <span className="text-xs text-gray-500">
                      {review.date.toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex gap-3">
            <button
              onClick={onContact}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              צור קשר
            </button>
            <button
              onClick={onBooking}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              הזמנה מהירה
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitterDetails;