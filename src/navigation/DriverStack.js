import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHome from '../screens/driver/DriverHome';
import DriverRequests from '../screens/driver/DriverRequests';
import DriverEarnings from '../screens/driver/DriverEarnings';
import ActiveTrip from '../screens/driver/ActiveTripStack';
import DocumentsUploads from '../screens/driver/DocumentsUploads';

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="DriverHome" component={DriverHome} />
      <Stack.Screen name="DriverRequests" component={DriverRequests} />
      <Stack.Screen name="DriverEarnings" component={DriverEarnings} />
    </Stack.Navigator>
  );
}