import { CreditCard, Dog, Heart, MapPin, Shield, User, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
    addClientDog,
    registerClientProfile,
    registerSitterProfile,
} from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import { NEIGHBORHOODS } from "../../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<
    "choice" | "login" | "client-register" | "sitter-register"
  >("choice");
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "sitter" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    phone: "",
    verificationCode: "",
    password: "",

    // Client specific
    dogName: "",
    dogBreed: "",
    dogAge: "",
    dogInfo: "",
    dogImage: null as File | null,
    neighborhood: "",

    // Sitter specific
    fullName: "",
    profileImage: null as File | null,
    description: "",
    idImage: null as File | null,
    selfieImage: null as File | null,
    neighborhoods: [] as string[],
    availability: {} as Record<string, { start: string; end: string }>,
    services: {
      walk_30: { enabled: false, price: "" },
      walk_60: { enabled: false, price: "" },
      home_visit: { enabled: false, price: "" },
    },
    accountHolder: "",
    accountNumber: "",
    bankName: "",
  });

  const { loginWithPassword } = useAuth();

  if (!isOpen) return null;

  const handleUserTypeSelect = (type: "client" | "sitter") => {
    setUserType(type);
    setStep(type === "client" ? "client-register" : "sitter-register");
    setCurrentStep(1);
  };

  const handleLogin = async () => {
    await loginWithPassword(formData.email, formData.password);
    onSuccess?.();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep("choice");
    setCurrentStep(1);
    setUserType(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      verificationCode: "",
      password: "",
      dogName: "",
      dogBreed: "",
      dogAge: "",
      dogInfo: "",
      dogImage: null,
      neighborhood: "",
      fullName: "",
      profileImage: null,
      description: "",
      idImage: null,
      selfieImage: null,
      neighborhoods: [],
      availability: {},
      services: {
        walk_30: { enabled: false, price: "" },
        walk_60: { enabled: false, price: "" },
        home_visit: { enabled: false, price: "" },
      },
      accountHolder: "",
      accountNumber: "",
      bankName: "",
    });
  };

  const handleNext = () => {
    const maxSteps = step === "client-register" ? 4 : 5;
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const renderChoice = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ברוכים הבאים!</h2>
        <p className="text-gray-600">בחרו את סוג המשתמש שלכם</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleUserTypeSelect("client")}
          className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Dog className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-900">אני בעל כלב</h3>
              <p className="text-sm text-gray-600">מחפש סיטר לכלב שלי</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleUserTypeSelect("sitter")}
          className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-900">אני סיטר</h3>
              <p className="text-sm text-gray-600">רוצה לטפל בכלבים</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep("login")}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          כבר יש לי חשבון - התחבר
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        התחברות
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אימייל
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          התחבר
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep("choice")}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          חזור לבחירת סוג משתמש
        </button>
      </div>
    </div>
  );

  const renderClientRegister = () => {
    const renderStep1 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          פרטים אישיים
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם פרטי *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="השם הפרטי שלך"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אימייל *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            טלפון נייד *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="050-1234567"
            required
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קוד אימות *
          </label>
          <input
            type="text"
            value={formData.verificationCode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                verificationCode: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הזן קוד שנשלח למייל"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            קוד אימות נשלח לכתובת המייל שהזנת
          </p>
        </div> */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
      </div>
    );

    const renderStep2 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Dog className="w-5 h-5" />
          פרופיל כלב
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם הכלב *
            </label>
            <input
              type="text"
              value={formData.dogName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dogName: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="שם הכלב"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              גזע *
            </label>
            <input
              type="text"
              value={formData.dogBreed}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dogBreed: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="גזע הכלב"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            גיל *
          </label>
          <input
            type="number"
            min="0"
            max="25"
            value={formData.dogAge}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dogAge: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="גיל בשנים"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מידע נוסף
          </label>
          <textarea
            value={formData.dogInfo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dogInfo: e.target.value }))
            }
            rows={3}
            maxLength={300}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="מידע נוסף על הכלב (עד 300 תווים)"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.dogInfo.length}/300 תווים
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תמונה של הכלב *
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              handleFileChange("dogImage", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">JPG או PNG, עד 5MB</p>
        </div>
      </div>
    );

    const renderStep3 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          שכונה
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכונה *
          </label>
          <select
            value={formData.neighborhood}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">בחר שכונה</option>
            {NEIGHBORHOODS.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>
      </div>
    );

    const renderStep4 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">סיכום ואישור</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">פרטים אישיים</h4>
            <p className="text-sm text-blue-800">
              {formData.name} • {formData.email} • {formData.phone}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">פרטי הכלב</h4>
            <p className="text-sm text-green-800">
              {formData.dogName} • {formData.dogBreed} • {formData.dogAge} שנים
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">מיקום</h4>
            <p className="text-sm text-purple-800">{formData.neighborhood}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirm-client"
            required
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="confirm-client" className="text-sm text-gray-700">
            אני מאשר שהפרטים נכונים ומסכים לתנאי השימוש
          </label>
        </div>
      </div>
    );

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const renderSitterRegister = () => {
    const renderStep1 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          פרטים אישיים והיכרות
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם מלא *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="השם המלא שלך"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אימייל *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            טלפון נייד *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="050-1234567"
            required
          />
        </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קוד אימות *
          </label>
          <input
            type="text"
            value={formData.verificationCode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                verificationCode: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הזן קוד שנשלח למייל"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            קוד אימות נשלח לכתובת המייל שהזנת
          </p>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תמונת פרופיל *
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              handleFileChange("profileImage", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ספר על עצמך
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ספר על הניסיון שלך עם כלבים (עד 500 תווים)"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 תווים
          </p>
        </div>
      </div>
    );

    const renderStep2 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          אימות זהות ואמון
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            צילום תעודה מזהה *
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              handleFileChange("idImage", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">JPG או PNG, עד 5MB</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סלפי לאימות פנים *
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              handleFileChange("selfieImage", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">תמונה ברורה של הפנים</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            אני מסכים לתנאי השימוש ומדיניות הפרטיות *
          </label>
        </div>
      </div>
    );

    const renderStep3 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">אזורי פעילות וזמינות</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכונות עבודה *
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {NEIGHBORHOODS.map((neighborhood) => (
              <label key={neighborhood} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.neighborhoods.includes(neighborhood)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        neighborhoods: [...prev.neighborhoods, neighborhood],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        neighborhoods: prev.neighborhoods.filter(
                          (n) => n !== neighborhood
                        ),
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{neighborhood}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שירותים ומחירים *
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.services.walk_30.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        walk_30: {
                          ...prev.services.walk_30,
                          enabled: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>הליכה 30 דק׳</span>
              </div>
              {formData.services.walk_30.enabled && (
                <input
                  type="number"
                  min="30"
                  value={formData.services.walk_30.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        walk_30: {
                          ...prev.services.walk_30,
                          price: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="₪"
                />
              )}
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.services.walk_60.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        walk_60: {
                          ...prev.services.walk_60,
                          enabled: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>הליכה 60 דק׳</span>
              </div>
              {formData.services.walk_60.enabled && (
                <input
                  type="number"
                  min="30"
                  value={formData.services.walk_60.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        walk_60: {
                          ...prev.services.walk_60,
                          price: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="₪"
                />
              )}
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.services.home_visit.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        home_visit: {
                          ...prev.services.home_visit,
                          enabled: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>ביקור בית</span>
              </div>
              {formData.services.home_visit.enabled && (
                <input
                  type="number"
                  min="30"
                  value={formData.services.home_visit.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services: {
                        ...prev.services,
                        home_visit: {
                          ...prev.services.home_visit,
                          price: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="₪"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );

    const renderStep4 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          פרטי קבלת כספים
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם בעל החשבון *
          </label>
          <input
            type="text"
            value={formData.accountHolder}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                accountHolder: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="שם מלא כפי שמופיע בחשבון הבנק"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר חשבון *
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                accountNumber: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="מספר חשבון בנק"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם הבנק *
          </label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bankName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="שם הבנק"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bank-confirm"
            required
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="bank-confirm" className="text-sm text-gray-700">
            אני מאשר שהכספים יועברו לחשבון זה *
          </label>
        </div>
      </div>
    );

    const renderStep5 = () => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">סיכום ואישור</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">פרטים אישיים</h4>
            <p className="text-sm text-blue-800">
              {formData.fullName} • {formData.email} • {formData.phone}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">אזורי פעילות</h4>
            <p className="text-sm text-green-800">
              {formData.neighborhoods.join(", ")}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">שירותים</h4>
            <div className="text-sm text-purple-800">
              {formData.services.walk_30.enabled && (
                <p>הליכה 30 דק׳ - ₪{formData.services.walk_30.price}</p>
              )}
              {formData.services.walk_60.enabled && (
                <p>הליכה 60 דק׳ - ₪{formData.services.walk_60.price}</p>
              )}
              {formData.services.home_visit.enabled && (
                <p>ביקור בית - ₪{formData.services.home_visit.price}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirm-sitter"
            required
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="confirm-sitter" className="text-sm text-gray-700">
            אני מאשר שהמידע נכון ומסכים לתנאי השימוש *
          </label>
        </div>
      </div>
    );

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    if (step === "client-register") {
      const titles = ["פרטים אישיים", "פרופיל כלב", "שכונה", "סיכום ואישור"];
      return titles[currentStep - 1];
    } else if (step === "sitter-register") {
      const titles = [
        "פרטים אישיים",
        "אימות זהות",
        "פעילות ושירותים",
        "פרטי תשלום",
        "סיכום ואישור",
      ];
      return titles[currentStep - 1];
    }
    return "";
  };

  const getTotalSteps = () => {
    return step === "client-register" ? 4 : 5;
  };

  const canProceed = () => {
    if (step === "client-register") {
      switch (currentStep) {
        case 1:
          return (
            formData.name &&
            formData.email &&
            formData.phone &&
            // formData.verificationCode
            formData.password
          );
        case 2:
          return (
            formData.dogName &&
            formData.dogBreed &&
            formData.dogAge &&
            formData.dogImage
          );
        case 3:
          return formData.neighborhood;
        case 4:
          return true;
        default:
          return false;
      }
    } else if (step === "sitter-register") {
      switch (currentStep) {
        case 1:
          return (
            formData.fullName &&
            formData.email &&
            formData.phone &&
            formData.password &&
            // formData.verificationCode &&
            formData.profileImage
          );
        case 2:
          return formData.idImage && formData.selfieImage;
        case 3:
          return (
            formData.neighborhoods.length > 0 &&
            Object.values(formData.services).some((s) => s.enabled && s.price)
          );
        case 4:
          return (
            formData.accountHolder &&
            formData.accountNumber &&
            formData.bankName
          );
        case 5:
          return true;
        default:
          return false;
      }
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="w-6" />
          <h1 className="text-lg font-semibold">DogSitter</h1>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {(step === "client-register" || step === "sitter-register") && (
          <div className="px-4 py-2">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>
                שלב {currentStep} מתוך {getTotalSteps()}
              </span>
              <span>{Math.round((currentStep / getTotalSteps()) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{getStepTitle()}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {step === "choice" && renderChoice()}
          {step === "login" && renderLogin()}
          {step === "client-register" && renderClientRegister()}
          {step === "sitter-register" && renderSitterRegister()}
        </div>

        {/* Footer */}
        {(step === "client-register" || step === "sitter-register") && (
          <div className="flex gap-3 p-4 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                הקודם
              </button>
            )}
            {currentStep < getTotalSteps() ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                הבא
              </button>
            ) : (
              <button
                onClick={async () => {
                    setIsLoading(true);

                    console.log({formData})
                  if (step === "client-register") {
                    // Sign up and create client profile + dog
                    const { data, error } = await supabase.auth.signUp({
                      email: formData.email,
                      password: formData.password || crypto.randomUUID(),
                      options: { data: { name: formData.name } },
                    });

                    console.log("signup data", {data, error})
                    if (error) return;
                    await registerClientProfile({
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      neighborhood: formData.neighborhood,
                    });
                    await addClientDog({
                      client_id: data.user!.id,
                      name: formData.dogName,
                      breed: formData.dogBreed,
                      age: Number(formData.dogAge),
                      size: "large",
                      image: undefined,
                      additional_info: formData.dogInfo,
                    });
                    onSuccess?.();
                    onClose();
                    resetForm();
                  } else {
                    // Sitter register
                    const enabledServices: Array<{
                      service_type: "walk_30" | "walk_60" | "home_visit";
                      price_cents: number;
                    }> = [];
                    if (formData.services.walk_30.enabled)
                      enabledServices.push({
                        service_type: "walk_30",
                        price_cents: Math.round(
                          Number(formData.services.walk_30.price) * 100
                        ),
                      });
                    if (formData.services.walk_60.enabled)
                      enabledServices.push({
                        service_type: "walk_60",
                        price_cents: Math.round(
                          Number(formData.services.walk_60.price) * 100
                        ),
                      });
                    if (formData.services.home_visit.enabled)
                      enabledServices.push({
                        service_type: "home_visit",
                        price_cents: Math.round(
                          Number(formData.services.home_visit.price) * 100
                        ),
                      });
                    const { error } = await supabase.auth.signUp({
                      email: formData.email,
                      password: formData.password || crypto.randomUUID(),
                      options: { data: { name: formData.fullName } },
                    });
                    if (error) return;
                    await registerSitterProfile({
                      fullName: formData.fullName,
                      email: formData.email,
                      phone: formData.phone,
                      description: formData.description,
                      neighborhoods: formData.neighborhoods,
                      services: enabledServices,
                    });
                    onSuccess?.();
                    onClose();
                    resetForm();
                  }
                  setIsLoading(false);
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isLoading ? '......' : step === "client-register" ? "סיום הרשמה" : "שלח לאישור"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
