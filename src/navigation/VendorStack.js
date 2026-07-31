import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorHome from '../screens/vendor/VendorHome';
import VendorOrders from '../screens/vendor/VendorOrders';
import VendorProducts from '../screens/vendor/VendorProducts';
import ShopProfile from '../screens/vendor/ShopProfile';


const Stack = createNativeStackNavigator();

export default function VendorStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="VendorHome" component={VendorHome} />
      <Stack.Screen name="VendorOrders" component={VendorOrders} />
      <Stack.Screen name="VendorProducts" component={VendorProducts} />
    </Stack.Navigator>
  );
}