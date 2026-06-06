import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Services: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const translations = {
  sw: {
    welcome: 'Karibu Gia',
    subtitle: 'Anza kutumia sasa',
    startButton: 'Bonyeza',
    language: 'Lugha: Kiswahili'
  },
  en: {
    welcome: 'Welcome to Gia',
    subtitle: 'Start using now',
    startButton: 'Start',
    language: 'Lang: English'
  }
} as const;

type LanguageType = keyof typeof translations;

export default function HomeScreen({ navigation }: Props) {
  const [language, setLanguage] = useState<LanguageType>('sw');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang === 'sw' || savedLang === 'en') {
        setLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLang: LanguageType = language === 'sw'? 'en' : 'sw';
    setLanguage(newLang);
    await AsyncStorage.setItem('appLanguage', newLang);
  };

  const t = translations[language];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
        <Text style={styles.langButtonText}>{t.language}</Text>
      </TouchableOpacity>

      

      <Text style={styles.title}>{t.welcome}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Services')}
      >
        <Text style={styles.buttonText}>{t.startButton}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13b499',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  langButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13b499'
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff'
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});