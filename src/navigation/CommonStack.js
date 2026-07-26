import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Common Screens
import Profile from '../screens/common/Profile';
import Settings from '../screens/common/Settings';
import Help from '../screens/common/Help';
import Notification from '../screens/common/Notification';
import ShareApp from '../screens/common/ShareApp';
import LanguageSelect from '../screens/common/LanguageSelect';

// Role Specific Screens ambazo zinaitwa kutoka Profile
import DocumentsUploads from '../screens/driver/DocumentsUploads';
import DriverEarnings from '../screens/driver/DriverEarnings';
import ShopProfile from '../screens/vendor/ShopProfile';
import VendorProducts from '../screens/vendor/VendorProducts';
import VendorOrders from '../screens/vendor/VendorOrders';
import Wallet from '../screens/customer/Wallet';

import AddProduct from '../screens/vendor/AddProduct';

const Stack = createNativeStackNavigator();

export default function CommonStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Nyuma',
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#000',
      }}
    >
      {/* Profile ndio mwanzo */}
      <Stack.Screen 
        name="ProfileMain" 
        component={Profile} 
        options={{ headerShown: false }} 
      />

      {/* Screens za kila mtu */}
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Mipangilio' }} />
      <Stack.Screen name="Help" component={Help} options={{ title: 'Msaada' }} />
      <Stack.Screen name="Notification" component={Notification} options={{ title: 'Taarifa' }} />
      <Stack.Screen name="ShareApp" component={ShareApp} options={{ title: 'Share App' }} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} options={{ title: 'Lugha' }} />
      <Stack.Screen name="Wallet" component={Wallet} options={{ title: 'Pochi' }} />

      {/* Screens za Driver - zitaonekana tu kama role ni driver */}
      <Stack.Screen name="DocumentsUploads" component={DocumentsUploads} options={{ title: 'Nyaraka Zangu' }} />
      <Stack.Screen name="DriverEarnings" component={DriverEarnings} options={{ title: 'Mapato' }} />

      {/* Screens za Vendor */}
      <Stack.Screen name="ShopProfile" component={ShopProfile} options={{ title: 'Duka Langu' }} />
      <Stack.Screen name="VendorProducts" component={VendorProducts} options={{ title: 'Bidhaa Zangu' }} />
      <Stack.Screen name="VendorOrders" component={VendorOrders} options={{ title: 'Oda Zangu' }} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      
    </Stack.Navigator>
  );
}