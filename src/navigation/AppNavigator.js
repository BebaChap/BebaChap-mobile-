import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import AdminTab from './AdminTab';
import DriverTab from './DriverTab';
import VendorTab from './VendorTab';
import CustomerTab from './CustomerTab';

import Profile from '../screens/common/Profile';
import Settings from '../screens/common/Settings';
import Help from '../screens/common/Help';
import Notification from '../screens/common/Notification';
import LanguageSelect from '../screens/common/LanguageSelect';
import ShareApp from '../screens/common/ShareApp';
import CommonStack from './CommonStack';
import LiveTracking from '../screens/customer/LiveTracking';
import ForgotPassword from '../screens/auth/ForgotPassword';

const Stack = createNativeStackNavigator();

// Fix: t ilikuwa undefined hapa
function PendingScreen() {
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  return (
    <View style={pendingStyles.container}>
      <Text style={pendingStyles.emoji}>⏳</Text>
      <Text style={pendingStyles.title}>{t('application_received')}</Text>
      <Text style={pendingStyles.subtitle}>
        Karibu {user?.name}!{'\n\n'}Akaunti yako ya {user?.role?.toUpperCase()} 
        {user?.vendorType ? ` (${user.vendorType === 'restaurant' ? '🍽 Restaurant' : '🏪 Duka'})` : ''} 
        {'\n'}ipo kwenye uhakiki.
      </Text>
      <Text style={pendingStyles.desc}>{t('wait_admin_approval')}</Text>
      <TouchableOpacity style={pendingStyles.logoutBtn} onPress={logout}>
        <Text style={pendingStyles.logoutText}>{t('exit_try_later')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  console.log('CURRENT USER:', user);

  // HAKUNA tena if (!user) return <AuthNavigator /> hapa
  // Hiyo logic sasa iko App.js

  if (user?.status === 'pending') {
    return <PendingScreen />;
  }

  return (
    <Stack.Navigator
      key={`${user.role}-${user.vendorType || 'default'}-${user.status}`}
      screenOptions={{ headerShown: false }}
      initialRouteName={
        user.role === 'admin' ? 'AdminApp' :
        user.role === 'driver' ? 'DriverApp' :
        user.role === 'vendor' || user.role === 'garage' ? 'VendorApp' :
        'CustomerApp'
      }
    >
      <Stack.Screen name="AdminApp" component={AdminTab} />
      <Stack.Screen name="DriverApp" component={DriverTab} />
      <Stack.Screen name="VendorApp" component={VendorTab} />
      <Stack.Screen name="CustomerApp" component={CustomerTab} />
      
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
      <Stack.Screen name="ShareApp" component={ShareApp} />
      <Stack.Screen name="CommonStack" component={CommonStack} />
      <Stack.Screen name="LiveTracking" component={LiveTracking} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

const pendingStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#333', lineHeight: 22, marginBottom: 15 },
  desc: { fontSize: 14, textAlign: 'center', color: '#888', marginBottom: 30 },
  logoutBtn: { backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 10 },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});