import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VendorHome from '../screens/vendor/VendorHome';
import VendorOrders from '../screens/vendor/VendorOrders';
import CommonStack from './CommonStack';

const Tab = createBottomTabNavigator();

export default function VendorTab() {
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
        name="Home"
        component={VendorHome}
        options={{
          tabBarLabel: t('nyumbani'),
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Orders"
        component={VendorOrders}
        options={{
          tabBarLabel: t('orders_lbl'),
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />
        }}
      />
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
