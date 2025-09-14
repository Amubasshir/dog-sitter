import React, { useState } from 'react';
import { X, Dog, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { SERVICE_TYPES, NEIGHBORHOODS } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface NewRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: any) => void;
}

const NewRequestForm: React.FC<NewRequestFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    date: '',
    time: '',
    dogName: 'מקס',
    dogBreed: 'לברדור',
    dogAge: 3,
    dogSize: 'large',
    dogImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: 'אוהב לשחק עם כלבים אחרים',
    neighborhood: user?.neighborhood || '',
    specialInstructions: '',
    offeredPrice: '',
    flexible: false
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setStep(1);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">פרטי השירות</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">סוג שירות</label>
        <select
          value={formData.serviceType}
          onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">בחר סוג שירות</option>
          {Object.entries(SERVICE_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">תאריך</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שעה</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">פרטי הכלב</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שם הכלב</label>
          <input
            type="text"
            value={formData.dogName}
            onChange={(e) => setFormData(prev => ({ ...prev, dogName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">גזע</label>
          <input
            type="text"
            value={formData.dogBreed}
            onChange={(e) => setFormData(prev => ({ ...prev, dogBreed: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
          <input
            type="number"
            min="0"
            max="25"
            value={formData.dogAge}
            onChange={(e) => setFormData(prev => ({ ...prev, dogAge: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">גודל</label>
          <select
            value={formData.dogSize}
            onChange={(e) => setFormData(prev => ({ ...prev, dogSize: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="small">קטן</option>
            <option value="medium">בינוני</option>
            <option value="large">גדול</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">מידע נוסף</label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="מידע נוסף על הכלב..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">מיקום והוראות</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">שכונה</label>
        <select
          value={formData.neighborhood}
          onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">בחר שכונה</option>
          {NEIGHBORHOODS.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">הוראות מיוחדות</label>
        <textarea
          value={formData.specialInstructions}
          onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
          rows={4}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="הוראות מיוחדות לסיטר (עד 200 תווים)..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.specialInstructions.length}/200 תווים
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">תמחור וביטול</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">מחיר מוצע (₪)</label>
        <input
          type="number"
          min="30"
          value={formData.offeredPrice}
          onChange={(e) => setFormData(prev => ({ ...prev, offeredPrice: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="מינימום 30 ₪"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="flexible"
          checked={formData.flexible}
          onChange={(e) => setFormData(prev => ({ ...prev, flexible: e.target.checked }))}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="flexible" className="text-sm text-gray-700">
          גמיש במחיר (סיטרים יכולים להציע מחיר שונה)
        </label>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">מדיניות ביטול</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• ביטול עד 24 שעות לפני השירות - ללא עמלה</p>
          <p>• ביטול עד 2 שעות לפני השירות - עמלת ביטול של 50%</p>
          <p>• ביטול פחות מ-2 שעות לפני השירות - חיוב מלא</p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">סיכום ואישור</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">פרטי השירות</h4>
          <p className="text-sm text-blue-800">
            {SERVICE_TYPES[formData.serviceType as keyof typeof SERVICE_TYPES]} • {formData.date} • {formData.time}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">פרטי הכלב</h4>
          <p className="text-sm text-green-800">
            {formData.dogName} • {formData.dogBreed} • {formData.dogAge} שנים
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">מיקום ומחיר</h4>
          <p className="text-sm text-purple-800">
            {formData.neighborhood} • ₪{formData.offeredPrice} {formData.flexible && '(גמיש)'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="confirm"
          required
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="confirm" className="text-sm text-gray-700">
          אני מאשר שהפרטים נכונים ומסכים לתנאי השימוש
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold">בקשה חדשה</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>שלב {step} מתוך 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-white transition-all duration-200 font-medium"
            >
              הקודם
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.serviceType || !formData.date || !formData.time)) ||
                (step === 2 && (!formData.dogName || !formData.dogBreed)) ||
                (step === 3 && !formData.neighborhood) ||
                (step === 4 && !formData.offeredPrice)
              }
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              הבא
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm"
            >
              פרסם בקשה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequestForm;