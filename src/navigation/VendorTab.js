import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import VendorHome from '../screens/vendor/VendorHome';
import VendorOrders from '../screens/vendor/VendorOrders';
import CommonStack from './CommonStack';

const Tab = createBottomTabNavigator();

export default function VendorTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={VendorHome}
        options={{
          tabBarLabel: 'Nyumbani',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={VendorOrders}
        options={{
          tabBarLabel: 'Oda',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={CommonStack} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}