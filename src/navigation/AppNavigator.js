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

  console.log('CURRENT USER:', user);

  if (loading) return <Splash />;
  if (!user) return <AuthNavigator />;

  return (
    <Stack.Navigator
      key={user.role}
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
    </Stack.Navigator>
  );
}