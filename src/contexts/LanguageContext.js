import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
      try {
        const saved = await AsyncStorage.getItem('app_language');
        if (saved && translations[saved]) {
          setLanguageState(saved);
        }
      } catch (e) {
        console.log('Language load error', e);
      }
    })();
  }, []);

  const setLanguage = async (code) => {
    if (!translations[code]) {
      console.log('Translation missing for', code);
      return;
    }
    setLanguageState(code);
    await AsyncStorage.setItem('app_language', code);
    console.log("Lugha imebadilishwa:", code);
  };

  const t = useCallback((key) => {
    const langData = translations[language] || translations['sw'];
    if (langData && langData[key]) return langData[key];
    if (translations['en'] && translations['en'][key]) return translations['en'][key];
    if (translations['sw'] && translations['sw'][key]) return translations['sw'][key];
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      t,
      language,
      setLanguage,
      languages: LANGUAGES,
      currentLanguage: LANGUAGES.find(l => l.code === language) || LANGUAGES[0],
      changeLanguage: setLanguage,
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