import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // HAKIKISHA PATH HII IPO

export const AuthContext = createContext(undefined);

const ALLOWED_ROLES = ['customer', 'driver', 'vendor', 'garage'];
const SUPER_ADMIN_EMAIL = "admin@bebachap.co.tz";
// Email yako ya Supabase pia ni admin
const ALLOWED_ADMIN_EMAILS = [SUPER_ADMIN_EMAIL, "sadickjaphari22@gmail.com", "sadickjaphari@gmail.com"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempPhone, setTempPhone] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const GUEST_USER = {
    id: 'guest-' + Date.now(),
    phone: '',
    name: 'Mgeni',
    role: 'customer',
    vendorType: 'shop',
    status: 'active',
    isGuest: true,
  };

  const checkUser = async () => {
    try {
      await AsyncStorage.clear();
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(GUEST_USER);
    setLoading(false);
  };

  const checkAdminExists = async () => {
    try {
      // Angalia Supabase kwanza
      const { data } = await supabase.from('users').select('id').eq('user_type', 'admin').limit(1);
      if(data && data.length > 0) return true;
      const adminFlag = await AsyncStorage.getItem('admin_exists');
      return adminFlag === 'true';
    } catch (e) {
      return false;
    }
  };

  // ===== LOGIN MPYA INAYOELEWA ADMIN WA SUPABASE =====
  const login = async (phoneOrEmail, password, roleParam) => {
    setLoading(true);
    try {
      console.log("LOGIN TRY:", phoneOrEmail, roleParam);
      
      let cleanPhone = phoneOrEmail;
      // Kama ni namba, isafishe
      if(phoneOrEmail.startsWith('+') || /^\d/.test(phoneOrEmail)){
         cleanPhone = phoneOrEmail.replace(/\D/g,'');
         if(cleanPhone.startsWith('255')) cleanPhone = `+${cleanPhone}`;
         else {
           if(cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
           cleanPhone = `+255${cleanPhone}`;
         }
      }

      // 1. JARIBU SUPABASE KWANZA (kwa admin uliyeweka dashboard)
      // Tafuta kwa phone kwenye public.users
      const { data: supaProfile } = await supabase.from('users').select('*').or(`phone.eq.${cleanPhone},phone.eq.${phoneOrEmail}`).maybeSingle();
      
      if(supaProfile){
        console.log("SUPABASE PROFILE FOUND:", supaProfile);
        // Kama ni admin, mrudishe moja kwa moja kama admin
        const finalUser = {
          id: supaProfile.id,
          phone: supaProfile.phone,
          name: supaProfile.full_name,
          role: supaProfile.user_type, // customer/driver/vendor/garage/admin
          email: phoneOrEmail,
          status: 'active',
          token: 'supabase-token'
        };
        await AsyncStorage.setItem('user', JSON.stringify(finalUser));
        setUser(finalUser);
        if(finalUser.role === 'admin') await AsyncStorage.setItem('admin_exists', 'true');
        return { success: true, user: finalUser };
      }

      // 2. Kama ni email ya super admin
      if (ALLOWED_ADMIN_EMAILS.includes(phoneOrEmail) || phoneOrEmail === SUPER_ADMIN_EMAIL) {
         const adminUser = { id: 'admin-001', email: phoneOrEmail, name: 'Super Admin', role: 'admin', vendorType: 'shop', status: 'active', token: 'fake-jwt-admin-token' };
         await AsyncStorage.setItem('user', JSON.stringify(adminUser));
         await AsyncStorage.setItem('admin_exists', 'true');
         setUser(adminUser);
         return { success: true, message: 'Karibu Admin', user: adminUser };
      }

      // 3. FALLBACK: Angalia AsyncStorage (logic yako ya zamani)
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      const found = allUsers.find(u => u.phone === cleanPhone || u.phone === phoneOrEmail || u.email === phoneOrEmail);

      if (found) {
        console.log("LOGIN FOUND IN STORAGE:", found);
        // USALAMA: Kama anajaribu kuingia kama admin lakini kwenye DB sio admin, kataa
        if(roleParam === 'admin' && found.role !== 'admin'){
          return { success: false, message: "Huna ruhusa ya admin" };
        }
        await AsyncStorage.setItem('user', JSON.stringify(found));
        setUser(found);
        return { success: true, message: 'Umefanikiwa kuingia', user: found };
      }

      // Kama hajapatikana na password imewekwa, kataa
      if(password){
        return { success: false, message: 'Namba au password si sahihi' };
      }

      // Kama hakuna password, peleka OTP (logic ya zamani)
      return { success: false, needOtp: true, message: 'OTP inahitajika' };

    } catch (error) {
      console.log("LOGIN ERROR", error);
      return { success: false, message: 'Email au password sio sahihi' };
    } finally {
      setLoading(false);
    }
  };

  const registerBusiness = async (payload) => {
    setLoading(true);
    try {
      // USALAMA: Zuia admin kujisajili hapa
      if (payload.role === 'admin') {
        if (!ALLOWED_ADMIN_EMAILS.includes(payload.email)) {
          return { success: false, message: "Huna ruhusa ya kujisajili kama admin" };
        }
        const exists = await checkAdminExists();
        if (exists) {
          return { success: false, message: "Admin tayari yupo" };
        }
        await AsyncStorage.setItem('admin_exists', 'true');
        return { success: true, message: "Super admin ameundwa" };
      }

      // USALAMA: Hakikisha role ni halali
      const safeRole = ALLOWED_ROLES.includes(payload.role) ? payload.role : 'customer';
      
      // Andika pia kwenye Supabase kama una supabase
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        // Kama tayari kuna auth user, tumia id yake
        const id = authUser?.id || Date.now().toString();
        // Jaribu kuweka kwenye public.users (kama RLS imeruhusu)
        await supabase.from('users').upsert({
          id: id,
          phone: payload.phone,
          full_name: payload.name,
          user_type: safeRole
        }, { onConflict: 'id' });
      } catch (e) {
        console.log("Supabase sync failed, using local only", e.message);
      }

      const allUsersRaw = await AsyncStorage.getItem('all_users');
      let allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      allUsers = allUsers.filter(u => u.email !== payload.email && u.phone !== payload.phone);

      const businessData = {
        id: Date.now().toString(),
        ...payload,
        role: safeRole,
        vendorType: payload.vendorType || 'shop',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      allUsers.push(businessData);
      await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));
      await AsyncStorage.setItem('user', JSON.stringify(businessData));
      setUser(businessData);
      
      console.log("REGISTER SAVED & LOGGED IN:", businessData.role);

      return { success: true, pending: false, message: "Umefanikiwa", user: businessData };
    } catch (e) {
      console.log(e);
      return { success: false, message: "Imeshindikana" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password, role) => {
    return await login(email, password, role);
  };

  const loginWithPhone = async (phone, role) => {
    return await login(phone, '', role);
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    return await registerBusiness({ name, email, phone, role });
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
        status: 'active',
        token: 'fake-jwt-token-123',
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
      await supabase.auth.signOut();
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