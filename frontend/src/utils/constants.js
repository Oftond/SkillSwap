// Константы приложения
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'education', label: 'Образование' },
  { value: 'music', label: 'Музыка' },
  { value: 'sports', label: 'Спорт' },
  { value: 'languages', label: 'Языки' },
  { value: 'programming', label: 'Программирование' },
  { value: 'art', label: 'Искусство' },
  { value: 'other', label: 'Другое' },
];

export const CATEGORY_COLORS = {
  education: 'bg-blue-100 text-blue-800',
  music: 'bg-purple-100 text-purple-800',
  sports: 'bg-green-100 text-green-800',
  languages: 'bg-yellow-100 text-yellow-800',
  programming: 'bg-red-100 text-red-800',
  art: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
};

export const CATEGORY_NAMES = {
  education: 'Образование',
  music: 'Музыка',
  sports: 'Спорт',
  languages: 'Языки',
  programming: 'Программирование',
  art: 'Искусство',
  other: 'Другое',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price_asc', label: 'Цена (по возрастанию)' },
  { value: 'price_desc', label: 'Цена (по убыванию)' },
];

export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CREATE_SERVICE: '/create-service',
  SERVICE: '/service/:id',
};