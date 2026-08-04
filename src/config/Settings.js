// src/config/settings.js - AKILI YA APP YAKO YOTE

export const SETTINGS = {
  // API
  API_URL: 'https://bebabackend.onrender.com/api',
  // API_URL_DEV: 'http://192.168.1.100:5000/api', // kwa localhost

  // MAPS
  GOOGLE_MAPS_API_KEY: 'AIzaSy...', // weka key yako hapa
  DEFAULT_LOCATION: {
    latitude: -6.7924,
    longitude: 39.2083,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },

  // APP INFO
  APP_NAME: 'BebaChap',
  APP_VERSION: '1.0.0',

  // COLORS - ili ukitaka kubadilisha rangi ubadilishe hapa tu
  COLORS: {
    primary: '#007AFF',
    secondary: '#111827',
    background: '#fff',
    text: '#111827',
    danger: '#EF4444',
  },

  // PRICES
  PRICE_PER_KM: 800,
  BASE_FARE: 2000,
};

// Hutaitumia hivi kwenye screen yoyote
// import { SETTINGS } from '../config/settings';
// fetch(`${SETTINGS.API_URL}/login`)