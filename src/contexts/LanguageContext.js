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
  sw: { welcome: 'Karibu', logout: 'Toka', home: 'Nyumbani', login: 'Ingia', welcome_back: 'Karibu tena! Ingiza taarifa zako', phone: 'Namba ya Simu', password: 'Nenosiri', forgot_password: 'Umesahau nenosiri?', no_account: 'Huna akaunti?', register: 'Jisajili', next: 'Endelea', selectLang: 'Chagua Lugha', enter_phone: 'Tafadhali ingiza namba ya simu' },
  en: { welcome: 'Welcome', logout: 'Logout', home: 'Home', login: 'Login', welcome_back: 'Welcome back! Enter your details', phone: 'Phone Number', password: 'Password', forgot_password: 'Forgot password?', no_account: 'No account?', register: 'Register', next: 'Continue', selectLang: 'Select Language', enter_phone: 'Please enter phone number' },
  fr: { welcome: 'Bienvenue', logout: 'Déconnexion', home: 'Accueil', login: 'Connexion', welcome_back: 'Bon retour! Entrez vos informations', phone: 'Numéro', password: 'Mot de passe', forgot_password: 'Mot de passe oublié?', no_account: 'Pas de compte?', register: 'S\'inscrire', next: 'Continuer', selectLang: 'Choisir la langue', enter_phone: 'Veuillez entrer le numéro' },
  ar: { welcome: 'مرحبا', logout: 'خروج', home: 'الرئيسية', login: 'تسجيل الدخول', welcome_back: 'مرحبا بعودتك!', phone: 'رقم الهاتف', password: 'كلمة المرور', forgot_password: 'نسيت كلمة المرور؟', no_account: 'ليس لديك حساب؟', register: 'تسجيل', next: 'متابعة', selectLang: 'اختر اللغة', enter_phone: 'الرجاء إدخال رقم الهاتف' },
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]);
  // Ongeza hizi mbili ili i-support code zote za zamani
  const lang = currentLanguage.code;

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('app_language');
        let phoneLang = 'sw';
        try {
          phoneLang = Localization.getLocales()?.[0]?.languageCode || 'sw';
        } catch (e) {}

        const initial = LANGUAGES.find(l => l.code === savedLang) ||
                       LANGUAGES.find(l => l.code === phoneLang) ||
                       LANGUAGES[0];
        setCurrentLanguage(initial);
      } catch (e) {
        console.log("Lang load error", e);
      }
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
    return translations[currentLanguage.code]?.[key] || translations['sw']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      lang, // <-- nimeongeza hii kwa ajili ya compatibility
      language: currentLanguage.code, // <-- na hii
      languages: LANGUAGES,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage lazima itumike ndani ya LanguageProvider');
  return context;
};