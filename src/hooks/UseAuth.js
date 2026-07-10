import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/authcontext';
import { getItem, STORAGE_KEYS } from '../services/StorageService';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth lazima itumike ndani ya AuthProvider');
  }

  return context;
};

// Hii ndio logic ya AuthProvider. Weka ndani ya src/contexts/AuthContext.js
export const useAuthProvider = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const token = await getItem(STORAGE_KEYS.TOKEN);
      const userData = await getItem(STORAGE_KEYS.USER);
      const userRole = await getItem(STORAGE_KEYS.ROLE);

      if (token && userData) {
        setUser(userData);
        setRole(userRole);
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, userRole, token) => {
    await setItem(STORAGE_KEYS.TOKEN, token);
    await setItem(STORAGE_KEYS.USER, userData);
    await setItem(STORAGE_KEYS.ROLE, userRole);
    setUser(userData);
    setRole(userRole);
  };

  const logout = async () => {
    await removeItem(STORAGE_KEYS.TOKEN);
    await removeItem(STORAGE_KEYS.USER);
    await removeItem(STORAGE_KEYS.ROLE);
    setUser(null);
    setRole(null);
  };

  return { user, role, loading, login, logout };
};
