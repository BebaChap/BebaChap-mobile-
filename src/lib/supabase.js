// src/lib/supabase.js
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ipjacqxykfhutjduwbof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamFjcXh5a2ZodXRqZHV3Ym9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTAyNDAsImV4cCI6MjA5NDc2NjI0MH0.38qv-u-H8yLAcb_BwSqKhNNPsTnU-9xB2oSSZ8XSoP8' // weka anon key yako hapa kutoka Project Settings > API

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
