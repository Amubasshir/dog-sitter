import React from 'react';
import { Clock, MapPin, DollarSign, Dog } from 'lucide-react';
import { Request, SERVICE_TYPES, DOG_SIZES } from '../../types';

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const formatTime = (date: Date, time: string) => {
    const today = new Date();
    const requestDate = new Date(date);
    
    if (requestDate.toDateString() === today.toDateString()) {
      return `היום ${time}`;
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (requestDate.toDateString() === tomorrow.toDateString()) {
      return `מחר ${time}`;
    }
    
    return `${requestDate.toLocaleDateString('he-IL')} ${time}`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] mx-4 hover:border-blue-200"
    >
      <div className="flex gap-4">
        {/* Dog Image */}
        <img
          src={request.dog.image}
          alt={request.dog.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {SERVICE_TYPES[request.serviceType]}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(request.date, request.time)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-700 text-lg">₪{request.offeredPrice}</span>
              </div>
              {request.flexible && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 mt-1 inline-block">
                  גמיש
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{request.neighborhood}</span>
          </div>

          {/* Dog Info */}
          <div className="flex items-center gap-2 mb-3">
            <Dog className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
              {request.dog.name} • {request.dog.breed} • {DOG_SIZES[request.dog.size]}
            </span>
          </div>

          {/* Client Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {request.client.name}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString('he-IL')}
            </span>
          </div>
          <div className="mt-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              request.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' :
              request.status === 'accepted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              request.status === 'completed' ? 'bg-gray-50 text-gray-700 border border-gray-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {request.status === 'open' ? 'פתוח' :
               request.status === 'accepted' ? 'התקבל' :
               request.status === 'completed' ? 'הושלם' :
               'בוטל'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;