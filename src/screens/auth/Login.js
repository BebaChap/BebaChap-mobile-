import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import StepButtons from '../../components/StepButtons';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function Login({ navigation, route }) {
  const { t } = useLanguage(); // TUMETOA languages, language, setLanguage
  const { sendOtp, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = route.params?.role || 'customer';

  const formatPhone = (rawPhone) => {
    let clean = rawPhone.replace(/\D/g, '');
    if (clean.startsWith('255')) {
      return `+${clean}`;
    }
    if (clean.startsWith('0')) {
      clean = clean.substring(1);
    }
    return `+255${clean}`;
  };

  const handleNext = async () => {
    if (!phone.trim()) {
      Alert.alert(t('error'), t('enter_phone'));
      return;
    }
    if (phone.trim().length < 9) {
      Alert.alert(t('error'), t('invalid_phone'));
      return;
    }
    if (!password.trim()) {
      Alert.alert(t('error'), 'Ingiza password');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = formatPhone(phone);
      console.log('Inajaribu ku-login:', fullPhone, 'role:', role);

      // 1. JARIBU KU-LOGIN DIRECT
      if (login) {
        const resLogin = await login(fullPhone, password, role);

        if (resLogin.success) {
          // ===== FIX YA ADMIN HAPA =====
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
             .from('users')
             .select('user_type')
             .eq('id', user.id)
             .single();

            console.log('USER_TYPE FROM DB:', profile?.user_type);

            if (profile?.user_type === 'admin') {
              navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
              return;
            }
            if (profile?.user_type === 'driver') {
              navigation.reset({ index: 0, routes: [{ name: 'DriverHome' }] });
              return;
            }
          }
          return;
        } else {
          if (resLogin.message?.toLowerCase().includes('otp') || resLogin.needOtp) {
            const resOtp = await sendOtp(fullPhone);
            if (resOtp.success) {
              navigation.navigate('OTP', {
                phone: fullPhone,
                role: role,
                isLogin: true,
                name: ''
              });
            } else {
              Alert.alert(t('failed'), resOtp.message || t('try_again'));
            }
          } else {
            Alert.alert(t('failed'), resLogin.message || 'Namba au password si sahihi');
          }
        }
      } else {
        const res = await sendOtp(fullPhone);
        if (res.success) {
          navigation.navigate('OTP', {
            phone: fullPhone,
            role: role,
            isLogin: true,
            name: ''
          });
        } else {
          Alert.alert(t('failed'), res.message || t('try_again'));
        }
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert(t('failed'), error.message || t('try_again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{t('login')}</Text>
      <Text style={styles.subtitle}>{t('welcome_back')} as {role}</Text>

      <Text style={styles.label}>{t('phone')}</Text>
      <TextInput
        placeholder="716708080"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#999"
        maxLength={12}
      />

      <Text style={styles.label}>{t('password')}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.inputPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword? "eye-off" : "eye"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotText}>{t('forgot_password')}</Text>
      </TouchableOpacity>

      {loading? <ActivityIndicator size="large" color="#fff" style={{marginVertical: 20}} /> : (
        <StepButtons
          onNext={handleNext}
          nextText={t('next')}
        />
      )}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register', { role })}
      >
        <Text style={styles.registerText}>
          {t('no_account')} <Text style={styles.registerLink}>{t('register')}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#264d35', padding: 20, paddingTop: 60 },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 10, marginTop: 10 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#ffffff', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#ffffff', marginBottom: 30, textTransform: 'capitalize' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 16, marginBottom: 20, borderRadius: 12, fontSize: 16, backgroundColor: '#f9f9f9', color: '#000' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, backgroundColor: '#f9f9f9', marginBottom: 20 },
  inputPassword: { flex: 1, padding: 16, fontSize: 16, color: '#000' },
  eyeIcon: { padding: 12 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  registerButton: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 15, color: '#ddd' },
  registerLink: { color: '#fff', fontWeight: 'bold' },
});