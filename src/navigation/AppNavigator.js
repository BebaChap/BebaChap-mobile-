import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';

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
import Splash from '../screens/common/Splash';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Debug - angalia role halisi
  console.log('CURRENT USER:', user);

  if (loading) return <Splash />;
  if (!user) return <AuthNavigator />;

  const getInitialRoute = () => {
    switch (user?.role) {
      case 'admin': return 'AdminApp';
      case 'driver': return 'DriverApp';
      case 'vendor': return 'VendorApp';
      case 'garage': return 'VendorApp'; // kama unatumia VendorTab kwa garage
      case 'customer': 
      default: return 'CustomerApp'; // default iwe customer, si admin
    }
  };

  return (
    <Stack.Navigator 
      key={user.role || 'guest'} // force remount role ikibadilika
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminApp" component={AdminTab} />
      <Stack.Screen name="DriverApp" component={DriverTab} />
      <Stack.Screen name="VendorApp" component={VendorTab} />
      <Stack.Screen name="CustomerApp" component={CustomerTab} />
      
      {/* Screens za kawaida */}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
      <Stack.Screen name="ShareApp" component={ShareApp} />
    </Stack.Navigator>
  );
}