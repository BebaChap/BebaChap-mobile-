import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import Onboarding from '../screens/auth/Onboarding';
import LanguageSelect from '../screens/common/LanguageSelect';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  useEffect(() => {
    checkInitial();
  }, []);

  const checkInitial = async () => {
    try {
      const lang = await AsyncStorage.getItem('hasSelectedLanguage');
      const onboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSelectedLanguage(lang === 'true');
      setHasSeenOnboarding(onboarding === 'true');
    } catch (e) {
      setHasSelectedLanguage(false);
      setHasSeenOnboarding(false);
    }
  };

  if (hasSelectedLanguage === null || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  // LOGIC: Kama hajachagua lugha -> LanguageSelect
  // Kama hajaona Onboarding -> Onboarding
  // Kama ameona zote -> Login
  let initialRoute = "Login";
  if (!hasSelectedLanguage) initialRoute = "LanguageSelect";
  else if (!hasSeenOnboarding) initialRoute = "Onboarding";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} initialParams={{ firstTime: true }} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="OTP" component={Otp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}