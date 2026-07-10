import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import VendorHome from '../screens/vendor/VendorHome';
import VendorOrders from '../screens/vendor/VendorOrders';
import VendorProducts from '../screens/vendor/VendorProducts';
import ShopProfile from '../screens/vendor/ShopProfile';

import VendorStack from './VendorStack';

const Tab = createBottomTabNavigator();

export default function VendorTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={VendorHome}
        options={{
          tabBarLabel: 'Nyumbani',
          tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text>
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={VendorOrders}
        options={{
          tabBarLabel: 'Oda',
          tabBarIcon: () => <Text style={{fontSize: 20}}>📦</Text>
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={VendorProducts}
        options={{
          tabBarLabel: 'Bidhaa',
          tabBarIcon: () => <Text style={{fontSize: 20}}>🛍</Text>
        }}
      />
      <Tab.Screen 
        name="ShopProfile" 
        component={ShopProfile}
        options={{
          tabBarLabel: 'Duka',
          tabBarIcon: () => <Text style={{fontSize: 20}}>🏪</Text>
        }}
      />
    </Tab.Navigator>
  );
}