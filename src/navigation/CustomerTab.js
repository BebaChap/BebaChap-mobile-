import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens za Home
import HomeScreen from '../screens/customer/HomeScreen';
import ShopList from '../screens/customer/ShopList';
import GarageList from '../screens/customer/GarageList';
import RestaurantList from '../screens/customer/RestaurantList';
import RestaurantDetails from '../screens/customer/RestaurantDetails';
import ProductDetail from '../screens/customer/ProductDetail';
import Cart from '../screens/customer/Cart';
import Checkout from '../screens/customer/Checkout';
import RequestRide from '../screens/customer/RequestRide';
import Trips from '../screens/customer/Trips';
import Wallet from '../screens/customer/Wallet';
import CommonStack from './CommonStack';
import MapScreen from '../screens/common/MapScreen';
import BookService from '../screens/customer/BookService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ShopList" component={ShopList} />
      <Stack.Screen name="GarageList" component={GarageList} />
      <Stack.Screen name="RestaurantList" component={RestaurantList} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="RequestRide" component={RequestRide} />
      <Stack.Screen name="BookService" component={BookService} />
    </Stack.Navigator>
  );
};

export default function CustomerTab() {
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
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ 
          tabBarLabel: t('nyumbani'), 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: t('ramani'),
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Trips" 
        component={Trips} 
        options={{ 
          tabBarLabel: t('safari'), 
          tabBarIcon: ({ color, size }) => <Ionicons name="car-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={Wallet} 
        options={{ 
          tabBarLabel: t('pochi'), 
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />
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