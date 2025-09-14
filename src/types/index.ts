export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  userType: 'client' | 'sitter';
  neighborhood: string;
  createdAt: Date;
}

export interface Client extends User {
  userType: 'client';
  dogs: Dog[];
}

export interface Sitter extends User {
  userType: 'sitter';
  description: string;
  experience: string;
  neighborhoods: string[];
  services: Service[];
  availability: Availability[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  bankDetails?: BankDetails;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  temperament: 'calm' | 'energetic' | 'mixed';
  image: string;
  additionalInfo?: string;
  allergies?: string;
  specialNeeds?: string;
}

export interface Service {
  id: string;
  type: 'walk_30' | 'walk_60' | 'home_visit';
  price: number;
  description?: string;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Request {
  id: string;
  clientId: string;
  client: Client;
  serviceType: 'walk_30' | 'walk_60' | 'home_visit';
  date: Date;
  time: string;
  dog: Dog;
  neighborhood: string;
  specialInstructions?: string;
  offeredPrice: number;
  flexible: boolean;
  status: 'open' | 'accepted' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  date: Date;
}

export interface FilterOptions {
  neighborhoods: string[];
  serviceTypes: string[];
  priceRange: [number, number];
  rating: number;
  availability: string;
  dogSize: string[];
}

export const NEIGHBORHOODS = [
  'פלורנטין',
  'נווה צדק',
  'רוטשילד',
  'דיזנגוף',
  'תל אביב צפון',
  'יפו העתיקה',
  'עג׳מי',
  'שפירא',
  'הצפון הישן',
  'מונטיפיורי',
  'לב העיר',
  'שכונת התקווה',
  'רמת אביב',
  'צהלה',
  'אפקה'
];

export const SERVICE_TYPES = {
  walk_30: 'הליכה 30 דק׳',
  walk_60: 'הליכה 60 דק׳',
  home_visit: 'ביקור בית'
};

export const DOG_SIZES = {
  small: 'קטן',
  medium: 'בינוני',
  large: 'גדול'
};