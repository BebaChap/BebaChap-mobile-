import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminUsers from '../screens/admin/AdminUsers';
import Disputes from '../screens/admin/Disputes';
import CommonStack from './CommonStack';

const Tab = createBottomTabNavigator();

export default function AdminTab() {
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
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarLabel: t('dashboard'),
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsers}
        options={{
          tabBarLabel: t('users_lbl'),
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Disputes"
        component={Disputes}
        options={{
          tabBarLabel: t('disputes_lbl'),
          tabBarIcon: ({ color, size }) => <Ionicons name="scale-outline" size={size} color={color} />
        }}
      />
      {/* HII NDIO ULIYOSEMAUI-ONGEZE - SASA IPO NDANI SAHI */}
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
