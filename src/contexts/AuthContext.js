import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(undefined);

const ALLOWED_ROLES = ['customer', 'driver', 'vendor', 'garage'];
const SUPER_ADMIN_EMAIL = "admin@bebachap.co.tz";

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
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("CURRENT USER:", parsedUser);
      } else {
        console.log("CURRENT USER: null - Hakuna user aliye-login");
        setUser(null);
      }
    } catch (e) {
      console.log('Error loading user', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminExists = async () => {
    try {
      const adminFlag = await AsyncStorage.getItem('admin_exists');
      return adminFlag === 'true';
    } catch (e) {
      return false;
    }
  };

  const registerBusiness = async (payload) => {
    setLoading(true);
    try {
      if (payload.role === 'admin') {
        if (payload.email !== SUPER_ADMIN_EMAIL) {
          return { success: false, message: "Huna ruhusa ya kujisajili kama admin" };
        }
        const exists = await checkAdminExists();
        if (exists) {
          return { success: false, message: "Admin tayari yupo" };
        }
        await AsyncStorage.setItem('admin_exists', 'true');
        return { success: true, message: "Super admin ameundwa" };
      }

      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      allUsers = allUsers.filter(u => u.email !== payload.email && u.phone !== payload.phone);

      const businessData = {
        id: Date.now().toString(),
        ...payload,
        vendorType: payload.vendorType || 'shop',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      allUsers.push(businessData);
      await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));
      
      // HAPA NDIPO SIRI ILIPO - LOGIN MOJA KWA MOJA BILA OTP
      await AsyncStorage.setItem('user', JSON.stringify(businessData));
      setUser(businessData);
      
      console.log("REGISTER SAVED & LOGGED IN:", businessData.role, businessData.vendorType);

      return { success: true, pending: false, message: "Umefanikiwa", user: businessData };
    } catch (e) {
      console.log(e);
      return { success: false, message: "Imeshindikana" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password, role) => {
    setLoading(true);
    try {
      if (role === 'admin' && email !== SUPER_ADMIN_EMAIL) {
        return { success: false, message: "Huna ruhusa ya admin" };
      }
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      const existing = allUsers.find(u => u.email === email);

      if (existing) {
        await AsyncStorage.setItem('user', JSON.stringify(existing));
        setUser(existing);
        return { success: true, user: existing };
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        name: role === 'admin' ? 'Super Admin' : 'Mtumiaji',
        role: role,
        vendorType: 'shop',
        status: 'active',
        token: 'fake-jwt-token',
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      if (role === 'admin') await AsyncStorage.setItem('admin_exists', 'true');
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (e) {
      return { success: false, message: "Login imeshindikana" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phone, role) => {
    return await sendOtp(phone);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (email === SUPER_ADMIN_EMAIL) {
        const newUser = { id: 'admin-001', email, name: 'Super Admin', role: 'admin', vendorType: 'shop', status: 'active', token: 'fake-jwt-admin-token' };
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('admin_exists', 'true');
        setUser(newUser);
        return { success: true, message: 'Karibu Admin', user: newUser };
      }

      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      const found = allUsers.find(u => u.email === email || u.phone === email);

      if (found) {
        console.log("LOGIN CHECK:", found.email, found.status);
        await AsyncStorage.setItem('user', JSON.stringify(found));
        setUser(found);
        return { success: true, message: 'Umefanikiwa kuingia', user: found };
      }

      const newUser = { id: '1', email, name: 'Juma Mtumiaji', role: 'customer', vendorType: 'shop', status: 'active', token: 'fake-jwt-token-123' };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, message: 'Umefanikiwa kuingia', user: newUser };
    } catch (error) {
      return { success: false, message: 'Email au password sio sahihi' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    try {
      const safeRole = ALLOWED_ROLES.includes(role) ? role : 'customer';
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role: safeRole,
        vendorType: 'shop',
        status: 'active',
        token: 'fake-jwt-token-123'
      };
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      allUsers.push(newUser);
      await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));
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
      setTempPhone(phoneNumber);
      const fakeOtp = '123456';
      console.log(`\n\n========== OTP YAKO: ${fakeOtp} kwa ${phoneNumber} ==========\n\n`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: `OTP imetumwa: ${fakeOtp}`, otp: fakeOtp };
    } catch (error) {
      return { success: false, message: 'Imeshindikana kutuma OTP' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpCode, userData = {}) => {
    setLoading(true);
    try {
      if (otpCode.length !== 6) throw new Error('OTP lazima iwe tarakimu 6');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const requestedRole = userData.role || 'customer';
      const safeRole = ALLOWED_ROLES.includes(requestedRole) ? requestedRole : 'customer';
      
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      let existingBusiness = allUsers.find(u => u.phone === (userData.phone || tempPhone));

      const newUser = {
        id: existingBusiness?.id || Date.now().toString(),
        phone: userData.phone || tempPhone,
        name: userData.name || existingBusiness?.name || 'Mtumiaji Mpya',
        role: safeRole,
        vendorType: userData.vendorType || existingBusiness?.vendorType || 'shop',
        email: userData.email || existingBusiness?.email || '',
        nida: existingBusiness?.nida || '',
        status: 'active',
        token: 'fake-jwt-token-123',
        documents: existingBusiness?.documents || {}
      };

      allUsers = allUsers.filter(u => u.phone !== newUser.phone);
      allUsers.push(newUser);
      await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      console.log("USER BAADA YA OTP:", newUser);
      setTempPhone('');
      return { success: true, message: 'Umefanikiwa kuingia', user: newUser, pending: false };

    } catch (error) {
      return { success: false, message: error.message || 'OTP sio sahihi' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('user_token');
      setUser(null);
      setTempPhone('');
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  const updateUser = async (newData) => {
    try {
      const updated = { ...user, ...newData };
      if (updated.role === 'admin' && user?.role !== 'admin') {
        delete updated.role;
      }
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      allUsers = allUsers.map(u => u.id === updated.id ? updated : u);
      await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));
      setUser(updated);
      console.log("USER UPDATED:", updated);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const updateVendorType = async (type) => {
    if (!user) return { success: false };
    return await updateUser({ vendorType: type });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, tempPhone,
      login, register, sendOtp, verifyOtp,
      logout, updateUser, checkUser,
      registerBusiness, checkAdminExists,
      loginWithEmail, loginWithPhone,
      updateVendorType,
      SUPER_ADMIN_EMAIL
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