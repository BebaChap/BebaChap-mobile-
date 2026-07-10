import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminUsers from '../screens/admin/AdminUsers';
import Disputes from '../screens/admin/Disputes';

import AdminStack from './AdminStack';

const Tab = createBottomTabNavigator();

export default function AdminTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard}
        options={{
          tabBarLabel: 'Dashibodi',
          tabBarIcon: () => <Text style={{fontSize: 20}}>📊</Text>
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminUsers}
        options={{
          tabBarLabel: 'Watumiaji',
          tabBarIcon: () => <Text style={{fontSize: 20}}>👥</Text>
        }}
      />
      <Tab.Screen 
        name="Disputes" 
        component={Disputes}
        options={{
          tabBarLabel: 'Migogoro',
          tabBarIcon: () => <Text style={{fontSize: 20}}>⚖️</Text>
        }}
      />
    </Tab.Navigator>
  );
}