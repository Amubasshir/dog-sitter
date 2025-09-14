import { Sitter, Request, Client, Dog } from '../types';

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'מקס',
    breed: 'לברדור',
    age: 3,
    size: 'large',
    temperament: 'energetic',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: 'אוהב לשחק עם כלבים אחרים'
  },
  {
    id: '2',
    name: 'לונה',
    breed: 'פודל',
    age: 2,
    size: 'medium',
    temperament: 'calm',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: 'רגועה ונחמדה'
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'דני כהן',
    email: 'danny@example.com',
    phone: '050-1234567',
    userType: 'client',
    neighborhood: 'פלורנטין',
    createdAt: new Date(),
    dogs: [mockDogs[0]]
  },
  {
    id: '2',
    name: 'שרה לוי',
    email: 'sara@example.com',
    phone: '052-9876543',
    userType: 'client',
    neighborhood: 'נווה צדק',
    createdAt: new Date(),
    dogs: [mockDogs[1]]
  }
];

export const mockSitters: Sitter[] = [
  {
    id: '1',
    name: 'מיכל אברהם',
    email: 'michal@example.com',
    phone: '054-1111111',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    userType: 'sitter',
    neighborhood: 'פלורנטין',
    description: 'אוהבת כלבים מגיל צעיר, בעלת ניסיון של 5 שנים בטיפול בכלבים מכל הגדלים',
    experience: '5+ שנים',
    neighborhoods: ['פלורנטין', 'נווה צדק', 'רוטשילד'],
    services: [
      { id: '1', type: 'walk_30', price: 40 },
      { id: '2', type: 'walk_60', price: 70 },
      { id: '3', type: 'home_visit', price: 80 }
    ],
    availability: [
      { day: 'ראשון', startTime: '08:00', endTime: '18:00' },
      { day: 'שני', startTime: '08:00', endTime: '18:00' },
      { day: 'שלישי', startTime: '08:00', endTime: '18:00' }
    ],
    rating: 4.8,
    reviewCount: 23,
    verified: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'יוסי דוד',
    email: 'yossi@example.com',
    phone: '053-2222222',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    userType: 'sitter',
    neighborhood: 'דיזנגוף',
    description: 'מאמן כלבים מקצועי עם התמחות בכלבים גדולים ואנרגטיים',
    experience: '8+ שנים',
    neighborhoods: ['דיזנגוף', 'תל אביב צפון', 'רמת אביב'],
    services: [
      { id: '1', type: 'walk_30', price: 50 },
      { id: '2', type: 'walk_60', price: 85 },
      { id: '3', type: 'home_visit', price: 100 }
    ],
    availability: [
      { day: 'ראשון', startTime: '06:00', endTime: '20:00' },
      { day: 'שני', startTime: '06:00', endTime: '20:00' },
      { day: 'רביעי', startTime: '06:00', endTime: '20:00' }
    ],
    rating: 4.9,
    reviewCount: 41,
    verified: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'רונית גולן',
    email: 'ronit@example.com',
    phone: '052-3333333',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    userType: 'sitter',
    neighborhood: 'יפו העתיקה',
    description: 'מתמחה בכלבים קטנים וגורים, בעלת סבלנות רבה ואהבה אמיתית לבעלי חיים',
    experience: '3+ שנים',
    neighborhoods: ['יפו העתיקה', 'עג׳מי', 'נווה צדק'],
    services: [
      { id: '1', type: 'walk_30', price: 35 },
      { id: '2', type: 'walk_60', price: 60 },
      { id: '3', type: 'home_visit', price: 75 }
    ],
    availability: [
      { day: 'שני', startTime: '09:00', endTime: '17:00' },
      { day: 'רביעי', startTime: '09:00', endTime: '17:00' },
      { day: 'שישי', startTime: '09:00', endTime: '15:00' }
    ],
    rating: 4.7,
    reviewCount: 18,
    verified: true,
    createdAt: new Date()
  }
];

export const mockRequests: Request[] = [
  {
    id: '1',
    clientId: '1',
    client: mockClients[0],
    serviceType: 'walk_30',
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    time: '18:00',
    dog: mockDogs[0],
    neighborhood: 'פלורנטין',
    specialInstructions: 'מקס אוהב לרוץ בפארק, אנא הביאו כדור',
    offeredPrice: 45,
    flexible: true,
    status: 'open',
    createdAt: new Date()
  },
  {
    id: '2',
    clientId: '2',
    client: mockClients[1],
    serviceType: 'home_visit',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    time: '14:00',
    dog: mockDogs[1],
    neighborhood: 'נווה צדק',
    specialInstructions: 'לונה צריכה תרופה בשעה 15:00',
    offeredPrice: 80,
    flexible: false,
    status: 'open',
    createdAt: new Date()
  },
  {
    id: '3',
    clientId: '1',
    client: mockClients[0],
    serviceType: 'walk_60',
    date: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    time: '20:00',
    dog: mockDogs[0],
    neighborhood: 'פלורנטין',
    offeredPrice: 75,
    flexible: true,
    status: 'open',
    createdAt: new Date()
  }
];