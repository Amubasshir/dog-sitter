import React from 'react';
import { X, Clock, MapPin, DollarSign, Dog, User, MessageCircle, CheckCircle } from 'lucide-react';
import { Request, SERVICE_TYPES, DOG_SIZES } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface RequestDetailsProps {
  request: Request;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onContact: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  isOpen,
  onClose,
  onAccept,
  onContact
}) => {
  const { userType } = useAuth();

  if (!isOpen) return null;

  const formatDateTime = (date: Date, time: string) => {
    const today = new Date();
    const requestDate = new Date(date);
    
    if (requestDate.toDateString() === today.toDateString()) {
      return `היום, ${time}`;
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (requestDate.toDateString() === tomorrow.toDateString()) {
      return `מחר, ${time}`;
    }
    
    return `${requestDate.toLocaleDateString('he-IL')}, ${time}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold">פרטי בקשה</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Service Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {SERVICE_TYPES[request.serviceType]}
              </h1>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'open' ? 'bg-green-100 text-green-800 border border-green-200' :
                    request.status === 'accepted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    request.status === 'completed' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {request.status === 'open' ? 'בקשה פתוחה' :
                     request.status === 'accepted' ? 'בקשה התקבלה' :
                     request.status === 'completed' ? 'בקשה הושלמה' :
                     'בקשה בוטלה'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-100 px-3 py-2 rounded-full">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-700">₪{request.offeredPrice}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-700">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatDateTime(request.date, request.time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{request.neighborhood}</span>
              </div>
              {request.flexible && (
                <span className="px-3 py-1 bg-blue-200 text-blue-800 text-sm rounded-full font-medium">
                  גמיש במחיר
                </span>
              )}
            </div>
          </div>

          {/* Dog Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">פרטי הכלב</h3>
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={request.dog.image}
                alt={request.dog.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">{request.dog.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">גזע:</span> {request.dog.breed}</p>
                  <p><span className="font-medium">גיל:</span> {request.dog.age} שנים</p>
                  <p><span className="font-medium">גודל:</span> {DOG_SIZES[request.dog.size]}</p>
                  <p><span className="font-medium">מזג:</span> {request.dog.temperament === 'calm' ? 'רגוע' : 'אנרגטי'}</p>
                </div>
                {request.dog.additionalInfo && (
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">מידע נוסף:</span> {request.dog.additionalInfo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">פרטי הלקוח</h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{request.client.name}</h4>
                <p className="text-sm text-gray-600">{request.client.neighborhood}</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {request.specialInstructions && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">הוראות מיוחדות</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-gray-700">{request.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">מדיניות ביטול</h3>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
              <p>• ביטול עד 24 שעות לפני השירות - ללא עמלה</p>
              <p>• ביטול עד 2 שעות לפני השירות - עמלת ביטול של 50%</p>
              <p>• ביטול פחות מ-2 שעות לפני השירות - חיוב מלא</p>
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
              שלח הודעה
            </button>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              אני מעוניין
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;