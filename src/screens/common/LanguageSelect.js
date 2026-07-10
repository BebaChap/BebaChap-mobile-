import { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../../contexts/LanguageContext';

const LANGUAGES = [
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export default function LanguageSelect({ navigation, route }) {
  const { changeLanguage, language } = useContext(LanguageContext);
  const [selected, setSelected] = useState(language || 'sw');
  const [loading, setLoading] = useState(false);
  const isFirstTime = route?.params?.firstTime ?? true;

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang) {
        setSelected(savedLang);
      }
    } catch (e) {
      console.log('Error loading language', e);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('app_language', selected);
      await AsyncStorage.setItem('hasSelectedLanguage', 'true');
      await changeLanguage(selected);

      if (isFirstTime) {
        navigation.replace('Onboarding');
      } else {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', 'Imeshindikana kuhifadhi lugha');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.langItem, selected === item.code && styles.selected]}
      onPress={() => setSelected(item.code)}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.langName}>{item.name}</Text>
      {selected === item.code && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chagua Lugha / Choose Language</Text>
      
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Endelea / Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30, 
    marginTop: 20,
    color: '#1a1a1a'
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  selected: { 
    borderColor: '#007aff', 
    backgroundColor: '#e3f2fd' 
  },
  flag: { 
    fontSize: 28, 
    marginRight: 15 
  },
  langName: { 
    fontSize: 18, 
    flex: 1, 
    color: '#333',
    fontWeight: '500'
  },
  check: { 
    fontSize: 22, 
    color: '#007aff', 
    fontWeight: 'bold' 
  },
  button: {
    backgroundColor: '#007aff',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56
  },
  buttonDisabled: { 
    backgroundColor: '#b0b0b0' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
});