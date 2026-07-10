import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempPhone, setTempPhone] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.log('Error loading user', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Inajaribu kulogin:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: '1',
        email,
        name: 'Juma Mtumiaji',
        role: 'customer', // login ya email inabaki customer
        token: 'fake-jwt-token-123',
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, message: 'Umefanikiwa kuingia' };
    } catch (error) {
      return { success: false, message: 'Email au password sio sahihi' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = { id: Date.now().toString(), name, email, phone, role, token: 'fake-jwt-token-123' };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, message: 'Umefanikiwa kujiunga' };
    } catch (error) {
      return { success: false, message: 'Imeshindikana kujiunga' };
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    try {
      console.log('OTP imetumwa kwa:', phoneNumber);
      setTempPhone(phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'OTP imetumwa' };
    } catch (error) {
      return { success: false, message: 'Imeshindikana kutuma OTP' };
    } finally {
      setLoading(false);
    }
  };

  // --- HAPA NDIPO TUMEBADELISHA ---
  const verifyOtp = async (otpCode, userData = {}) => {
    setLoading(true);
    try {
      if (otpCode.length !== 6) throw new Error('OTP lazima iwe tarakimu 6');

      await new Promise(resolve => setTimeout(resolve, 800));

      const newUser = {
        id: Date.now().toString(),
        phone: userData.phone || tempPhone,
        name: userData.name || 'Mtumiaji Mpya',
        role: userData.role || 'customer', // <-- sasa inachukua driver/vendor/admin
        token: 'fake-jwt-token-123',
      };

      console.log('MOCK API: registering', newUser.role, 'na:', newUser.phone);

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setTempPhone('');
      return { success: true, message: 'Umefanikiwa kuingia', user: newUser };
    } catch (error) {
      return { success: false, message: error.message || 'OTP sio sahihi' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Error logout:', error);
    }
  };

  const updateUser = async (newData) => {
    try {
      const updated = { ...user, ...newData };
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, tempPhone,
      login, register, sendOtp, verifyOtp, 
      logout, updateUser, checkUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth lazima itumike ndani ya AuthProvider');
  return context;
};