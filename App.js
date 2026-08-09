import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import Splash from './src/screens/common/Splash';

function RootNavigation() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <Splash /> // tumia Splash yako moja kwa moja
  }

  // HAPA NDIPO LOGIC INAPOTAKIWA:
  // Kama hana user -> AuthNavigator (ambayo ina Onboarding ndani)
  // Kama ana user -> AppNavigator
  if (!user) {
    return <AuthNavigator />;
  }

  return <AppNavigator />;
}

function RootNavigationWrapper() {
  const { language } = useLanguage();
  return (
    <NavigationContainer key={language}>
      <RootNavigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AuthProvider>
          <RootNavigationWrapper />
        </AuthProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}