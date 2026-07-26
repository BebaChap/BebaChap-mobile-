import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n';

export const LANGUAGES = [
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('sw');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved) setLanguageState(saved);
    })();
  }, []);

  const setLanguage = async (code) => {
    setLanguageState(code);
    await AsyncStorage.setItem('app_language', code);
    console.log("Lugha imebadilishwa:", code);
  };

  const t = (key) => {
    const langData = translations[language] || translations['sw'];
    return langData[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      t,
      language,
      setLanguage,
      languages: LANGUAGES,
      currentLanguage: LANGUAGES.find(l => l.code === language) || LANGUAGES[0],
      changeLanguage: setLanguage, // kwa compatibility ya code ya zamani
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};