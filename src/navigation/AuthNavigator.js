import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import Onboarding from '../screens/auth/Onboarding';
import LanguageSelect from '../screens/common/LanguageSelect';
import Register from '../screens/auth/Register';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(null);

  useEffect(() => {
    checkLanguage();
  }, []);

  const checkLanguage = async () => {
    try {
      const hasSelected = await AsyncStorage.getItem('hasSelectedLanguage');
      setHasSelectedLanguage(hasSelected === 'true');
    } catch (e) {
      setHasSelectedLanguage(false);
    }
  };

  if (hasSelectedLanguage === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasSelectedLanguage ? "Login" : "LanguageSelect"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="OTP" component={Otp} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen 
        name="LanguageSelect" 
        component={LanguageSelect}
        initialParams={{ firstTime: true }}
      />
    </Stack.Navigator>
  );
}
