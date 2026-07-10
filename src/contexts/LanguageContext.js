import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const LANGUAGES = [
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const translations = {
  sw: { welcome: 'Karibu', logout: 'Toka', home: 'Nyumbani' },
  en: { welcome: 'Welcome', logout: 'Logout', home: 'Home' },
  fr: { welcome: 'Bienvenue', logout: 'Déconnexion', home: 'Accueil' },
  ar: { welcome: 'مرحبا', logout: 'تسجيل خروج', home: 'الرئيسية' },
};

export const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('app_language');
      const phoneLang = Localization.getLocales()[0]?.languageCode;
      const initial = LANGUAGES.find(l => l.code === savedLang) ||
                     LANGUAGES.find(l => l.code === phoneLang) ||
                     LANGUAGES[0];
      setCurrentLanguage(initial);
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (code) => {
    const selected = LANGUAGES.find(l => l.code === code);
    if (selected) {
      setCurrentLanguage(selected);
      await AsyncStorage.setItem('app_language', code);
    }
  };

  const t = (key) => {
    return translations[currentLanguage.code]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages: LANGUAGES, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage lazima itumike ndani ya LanguageProvider');
  return context;
};