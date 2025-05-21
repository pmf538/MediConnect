// API URL
export const API_URL = 'http://localhost:5000/api';

// Version de l'application
export const APP_VERSION = '1.0.0';

// Pagination par défaut
export const DEFAULT_PAGE_SIZE = 10;

// Formats de date
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Constants d'authentification
export const AUTH_TOKEN_KEY = 'medicalAppToken';
export const AUTH_USER_KEY = 'medicalAppUser';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  PATIENT_NEW: '/patients/new',
  APPOINTMENTS: '/appointments',
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_NEW: '/prescriptions/new',
  SCHEDULE: '/schedule',
  PROFILE: '/profile'
};

// Couleurs des statuts
export const STATUS_COLORS = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-700'
  },
  inactive: {
    bg: 'bg-slate-100',
    text: 'text-slate-700'
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700'
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-700'
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700'
  },
  scheduled: {
    bg: 'bg-blue-100',
    text: 'text-blue-700'
  },
  'checked-in': {
    bg: 'bg-green-100',
    text: 'text-green-700'
  },
  expired: {
    bg: 'bg-amber-100',
    text: 'text-amber-700'
  }
};