import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import Onboarding from '../screens/auth/Onboarding';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  useEffect(() => {
    checkInitial();
  }, []);

  const checkInitial = async () => {
    try {
      const onboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(onboarding === 'true');
    } catch (e) {
      setHasSeenOnboarding(false);
    }
  };

  if (hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  // LOGIC: Kama hajaona Onboarding -> Onboarding
  // Kama ameona -> Login
  const initialRoute = !hasSeenOnboarding ? "Onboarding" : "Login";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="OTP" component={Otp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}