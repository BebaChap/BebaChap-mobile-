import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import DriverHome from '../screens/driver/DriverHome';
import DriverRequests from '../screens/driver/DriverRequests';
import ActiveTrip from '../screens/driver/ActiveTrip';
import CommonStack from './CommonStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const DriverHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHomeMain" component={DriverHome} />
      <Stack.Screen name="ActiveTrip" component={ActiveTrip} />
    </Stack.Navigator>
  );
};

export default function DriverTab() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: '#fff',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab"
        component={DriverHomeStack}
        options={{
          tabBarLabel: t('nyumbani'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="RequestsTab"
        component={DriverRequests}
        options={{
          tabBarLabel: t('requests_lbl'),
          tabBarIcon: ({ color, size }) => <Ionicons name="car-sport-outline" size={size} color={color} />,
          tabBarBadge: 3 // optional - inaonyesha maombi mapya 3
        }}
      />
      {/* ✅ Tumeondoa Earnings na Documents kwenye Tab - zipo kwenye Profile sasa */}
      {/* ✅ HII NDIYO ULIYOSEMA UIONGEZE */}
      <Tab.Screen 
        name="ProfileTab" 
        component={CommonStack} 
        options={{ 
          tabBarLabel: t('profile'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}