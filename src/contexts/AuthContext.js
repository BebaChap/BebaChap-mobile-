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
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.log('Error loading user', e);
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
          return { success: false, message: "Admin tayari yupo, ni mtu mmoja tu" };
        }
        await AsyncStorage.setItem('admin_exists', 'true');
        return { success: true, message: "Super admin ameundwa" };
      }

      let status = 'active';
      if (['vendor', 'driver', 'garage'].includes(payload.role)) {
        status = 'pending';
      }

      const businessData = {
        ...payload,
        status,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('last_business_request', JSON.stringify(businessData));

      if (status === 'pending') {
        return { success: true, pending: true, message: "Maombi yako yamepokelewa, subiri admin akuidhinishe" };
      }

      return { success: true, message: "Umefanikiwa" };
    } catch (e) {
      console.log(e);
      return { success: false, message: "Imeshindikana kutuma maombi" };
    } finally {
      setLoading(false);
    }
  };

  // --- ONGEZA HIZI NDANI YA AuthProvider ---
  const loginWithEmail = async (email, password, role) => {
    setLoading(true);
    try {
      console.log('Login email:', email, 'role:', role);
      await new Promise(r => setTimeout(r, 1000));

      // Zuia mtu asijifanye admin kama email siyo SUPER_ADMIN_EMAIL
      if (role === 'admin' && email !== SUPER_ADMIN_EMAIL) {
        return { success: false, message: "Huna ruhusa ya admin" };
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        name: role === 'admin' ? 'Super Admin' : 'Mtumiaji',
        role: role,
        status: ['vendor','driver','garage'].includes(role) ? 'pending' : 'active',
        token: 'fake-jwt-token',
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      if (role === 'admin') await AsyncStorage.setItem('admin_exists', 'true');
      setUser(newUser);
      return { success: true };
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
        const newUser = {
          id: 'admin-001',
          email,
          name: 'Super Admin',
          role: 'admin',
          token: 'fake-jwt-admin-token',
        };
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('admin_exists', 'true');
        setUser(newUser);
        return { success: true, message: 'Karibu Admin' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: '1',
        email,
        name: 'Juma Mtumiaji',
        role: 'customer',
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
      const safeRole = ALLOWED_ROLES.includes(role) ? role : 'customer';
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = { id: Date.now().toString(), name, email, phone, role: safeRole, token: 'fake-jwt-token-123' };
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'OTP imetumwa' };
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

      const newUser = {
        id: Date.now().toString(),
        phone: userData.phone || tempPhone,
        name: userData.name || 'Mtumiaji Mpya',
        role: safeRole,
        status: ['vendor','driver','garage'].includes(safeRole) ? 'pending' : 'active',
        token: 'fake-jwt-token-123',
      };

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
      setTempPhone('');
    } catch (error) {
      console.log('Error logout:', error);
    }
  };

  const updateUser = async (newData) => {
    try {
      const updated = { ...user, ...newData };
      if (updated.role === 'admin' && user?.role !== 'admin') {
        delete updated.role;
      }
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
      logout, updateUser, checkUser,
      registerBusiness, checkAdminExists,
      loginWithEmail, loginWithPhone,
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