import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Tab screens zingine - ziaache hivi hivi
import ShopList from '../screens/customer/ShopList';
import GarageList from '../screens/customer/GarageList';
import Wallet from '../screens/customer/Wallet';

// ✅ STACK YA NYUMBANI - hii ndio muhimu
import CustomerStack from './CustomerStack';

const Tab = createBottomTabNavigator();

export default function CustomerTab() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#007aff',
        tabBarLabelStyle: { fontSize: 12 }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={CustomerStack}  // ✅ HII NDIO FIX KUBWA
        options={{ 
          tabBarLabel: 'Nyumbani', 
          tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text> 
        }} 
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopList} 
        options={{ 
          tabBarLabel: 'Duka', 
          tabBarIcon: () => <Text style={{fontSize: 20}}>🛒</Text> 
        }} 
      />
      <Tab.Screen 
        name="Garage" 
        component={GarageList} 
        options={{ 
          tabBarLabel: 'Gereji', 
          tabBarIcon: () => <Text style={{fontSize: 20}}>🔧</Text> 
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={Wallet} 
        options={{ 
          tabBarLabel: 'Pochi', 
          tabBarIcon: () => <Text style={{fontSize: 20}}>💰</Text> 
        }} 
      />
    </Tab.Navigator>
  );
}
