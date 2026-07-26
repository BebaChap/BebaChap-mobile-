import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';

function RootNavigation() {
  const { user, loading } = useAuth();
  const { t } = useLanguage(); // <-- TUMIA T() HAPA

  // HII NDIO FIX YA CURRENT USER: null - IMEBAKI KAMA ILIVYO
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('loading')}...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  }
});