import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens za Home
import HomeScreen from '../screens/customer/HomeScreen';
import ShopList from '../screens/customer/ShopList';
import GarageList from '../screens/customer/GarageList';
import ProductDetail from '../screens/customer/ProductDetail';
import Cart from '../screens/customer/Cart';
import RequestRide from '../screens/customer/RequestRide';
import LiveTracking from '../screens/customer/LiveTracking';
import TripHistory from '../screens/customer/TripHistory';
import Wallet from '../screens/customer/Wallet';
import CommonStack from './CommonStack';
import MapScreen from '../screens/common/MapScreen'; // <--- ONGEZO

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ShopList" component={ShopList} />
      <Stack.Screen name="GarageList" component={GarageList} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="RequestRide" component={RequestRide} />
      <Stack.Screen name="LiveTracking" component={LiveTracking} />
    </Stack.Navigator>
  );
};

export default function CustomerTab() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 8 }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ 
          tabBarLabel: 'Nyumbani', 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }} 
      />

      {/* --- TAB MPYA YA RAMANI --- */}
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Ramani',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />
        }} 
      />

      <Tab.Screen 
        name="Trips" 
        component={TripHistory} 
        options={{ 
          tabBarLabel: 'Safari', 
          tabBarIcon: ({ color, size }) => <Ionicons name="car-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={Wallet} 
        options={{ 
          tabBarLabel: 'Pochi', 
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />
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