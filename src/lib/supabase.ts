import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export const getGuestId = async () => {
  let guestId = await AsyncStorage.getItem('guestId');
  if (!guestId) {
    guestId = uuidv4();
    await AsyncStorage.setItem('guestId', guestId);
  }
  return guestId;
};