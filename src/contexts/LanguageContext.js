import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import * as Localization from 'expo-localization';
import { supabase } from '../lib/supabase';

import en from '../locales/en.js';
import sw from '../locales/sw.js';
import zh from '../locales/zh.js';
import ar from '../locales/ar.js';
import fr from '../locales/fr.js';
import hi from '../locales/hi.js';

const LanguageContext = createContext();
const LANGUAGES = ['sw', 'en', 'fr', 'ar', 'zh', 'hi'];
const dictionaries = { sw, en, fr, ar, zh, hi };
const RTL_LANGUAGES = ['ar'];
const STORAGE_KEY = 'app_language';
const RTL_SYNC_KEY = 'app_language_rtl_sync';

const detectDeviceLanguage = () => {
  try {
    const deviceLocales = Localization.getLocales();
    const code = deviceLocales?.[0]?.languageCode?.toLowerCase();
    return LANGUAGES.includes(code) ? code : 'sw';
  } catch (e) {
    return 'sw';
  }
};

const applyLayoutDirection = (lang) => {
  const isRTL = RTL_LANGUAGES.includes(lang);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

// Layout-direction flags only take effect after a full native restart.
const hardReload = () => {
  try {
    RNRestart.Restart();
  } catch (e) {}
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('sw');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      let resolved = null;
      try {
        resolved = await AsyncStorage.getItem(STORAGE_KEY);
      } catch (e) {
        resolved = null;
      }

      if (!resolved || !LANGUAGES.includes(resolved)) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase.from('users').select('language').eq('id', user.id).single();
            if (data?.language && LANGUAGES.includes(data.language)) {
              resolved = data.language;
              await AsyncStorage.setItem(STORAGE_KEY, resolved);
            }
          }
        } catch (e) {
          resolved = null;
        }
      }

      const finalLang = resolved && LANGUAGES.includes(resolved)
        ? resolved
        : detectDeviceLanguage();

      const wantsRTL = RTL_LANGUAGES.includes(finalLang);
      applyLayoutDirection(finalLang);

      // Self-heal: if the native layout direction is out of sync with the
      // saved language (e.g. leftover RTL from a previous Arabic session),
      // reload once so the UI is not mirrored.
      if (I18nManager.isRTL !== wantsRTL) {
        let lastSync = 0;
        try {
          lastSync = Number((await AsyncStorage.getItem(RTL_SYNC_KEY)) || 0);
        } catch (e) {}

        if (Date.now() - lastSync > 5000) {
          try { await AsyncStorage.setItem(STORAGE_KEY, finalLang); } catch (e) {}
          try { await AsyncStorage.setItem(RTL_SYNC_KEY, String(Date.now())); } catch (e) {}
          setTimeout(hardReload, 200);
          return; // keep splash visible until reload completes
        }
      }

      try { await AsyncStorage.removeItem(RTL_SYNC_KEY); } catch (e) {}
      setLanguage(finalLang);
      setLoading(false);
    };
    init();
  }, []);

  const persistLanguage = async (newLang) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {}
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ language: newLang }).eq('id', user.id);
      }
    } catch (e) {}
  };

  const changeLanguage = async (newLang) => {
    if (!LANGUAGES.includes(newLang)) return;

    const wantsRTL = RTL_LANGUAGES.includes(newLang);
    if (I18nManager.isRTL !== wantsRTL) {
      setLanguage(newLang);
      applyLayoutDirection(newLang);
      await persistLanguage(newLang);
      setTimeout(hardReload, 100);
      return;
    }

    setLanguage(newLang);
    await persistLanguage(newLang);
  };

  const t = (key, vars) => {
    let str = dictionaries[language]?.[key] || dictionaries['en']?.[key] || key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        str = str.split(`{{${name}}}`).join(String(value));
      }
    }
    return str;
  };

  const isRTL = RTL_LANGUAGES.includes(language);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, loading, LANGUAGES, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
