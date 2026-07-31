import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens zote za customer
import HomeScreen from '../screens/customer/HomeScreen';
import BookService from '../screens/customer/BookService';
import TripHistory from '../screens/customer/TripHistory'; // ✅ Umesha-import
import Cart from '../screens/customer/Cart';
import GarageList from '../screens/customer/GarageList';
import LiveTracking from '../screens/customer/LiveTracking';
import ProductDetail from '../screens/customer/ProductDetail';
import RequestRide from '../screens/customer/RequestRide';
import ShopList from '../screens/customer/ShopList';
import Wallet from '../screens/customer/Wallet';
import Otp from '../screens/auth/Otp';

const Stack = createStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#007aff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'BeBachap - Customer' }} 
      />
      
      <Stack.Screen 
        name="BookService" 
        component={BookService}
        options={{ 
          title: 'Weka Oda ya Service',
          headerShown: true 
        }} 
      />

      {/* ONGEZA HII 👇 */}
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetail}
        options={{ title: 'Maelezo ya Bidhaa' }} 
      />

      <Stack.Screen 
        name="TripHistory" 
        component={TripHistory}
        options={{ title: 'Historia ya Safari' }} 
      />

      <Stack.Screen 
        name="Cart" 
        component={Cart}
        options={{ title: 'Kikapu' }} 
      />

      <Stack.Screen 
        name="Wallet" 
        component={Wallet}
        options={{ title: 'Pochi Yangu' }} 
      />

      <Stack.Screen 
        name="RequestRide" 
        component={RequestRide}
        options={{ title: 'Omba Usafiri' }} 
      />

      <Stack.Screen 
        name="LiveTracking" 
        component={LiveTracking}
        options={{ title: 'Fuatilia Moja kwa Moja' }} 
      />
      
    </Stack.Navigator>
  );
}
