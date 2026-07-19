import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // badilisha kutoka Text
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminUsers from '../screens/admin/AdminUsers';
import Disputes from '../screens/admin/Disputes';
import CommonStack from './CommonStack'; // hii mpya

const Tab = createBottomTabNavigator();

export default function AdminTab() {
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
        name="Dashboard" 
        component={AdminDashboard}
        options={{
          tabBarLabel: 'Dashibodi',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminUsers}
        options={{
          tabBarLabel: 'Watumiaji',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Disputes" 
        component={Disputes}
        options={{
          tabBarLabel: 'Migogoro',
          tabBarIcon: ({ color, size }) => <Ionicons name="scale-outline" size={size} color={color} />
        }}
      />
      {/* HII NDIO ULIYOSEMAUI-ONGEZE - SASA IPO NDANI SAHI */}
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