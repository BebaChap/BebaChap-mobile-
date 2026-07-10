import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DriverHome from '../screens/driver/DriverHome';
import DriverRequests from '../screens/driver/DriverRequests';
import DriverEarnings from '../screens/driver/DriverEarnings';
import DocumentsUploads from '../screens/driver/DocumentsUploads';

const Tab = createBottomTabNavigator();

export default function DriverTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen 
        name="HomeTab"
        component={DriverHome} // ✅ tumia component halisi
        options={{
          tabBarLabel: 'Nyumbani',
          tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text>
        }}
      />
      <Tab.Screen 
        name="RequestsTab"
        component={DriverRequests} // ✅
        options={{
          tabBarLabel: 'Maombi',
          tabBarIcon: () => <Text style={{fontSize: 20}}>🚗</Text>
        }}
      />
      <Tab.Screen 
        name="EarningsTab"
        component={DriverEarnings} // ✅
        options={{
          tabBarLabel: 'Mapato',
          tabBarIcon: () => <Text style={{fontSize: 20}}>💰</Text>
        }}
      />
      <Tab.Screen 
        name="DocumentsTab"
        component={DocumentsUploads} // ongeza kama unataka
        options={{
          tabBarLabel: 'Nyaraka',
          tabBarIcon: () => <Text style={{fontSize: 20}}>📄</Text>
        }}
      />
    </Tab.Navigator>
  );
}