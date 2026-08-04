import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, FlatList, Image } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import StepButtons from '../../components/StepButtons';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation, route }) {
  const { t, language, setLanguage, languages } = useLanguage();
  const currentLanguage = languages.find(l => l.code === language) || languages[0];
  const { sendOtp, login } = useAuth(); // CHUKUA LOGIN PIA
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const role = route.params?.role || 'customer';

  // FUNCTION YA KUSAFA SIMU VIZURI
  const formatPhone = (rawPhone) => {
    let clean = rawPhone.replace(/\D/g, ''); // toa kila kitu sio namba
    if (clean.startsWith('255')) {
      return `+${clean}`;
    }
    if (clean.startsWith('0')) {
      clean = clean.substring(1); // toa 0 ya mwanzo
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

      // 1. JARIBU KU-LOGIN DIRECT KWA PASSWORD KWANZA
      if (login) {
        const resLogin = await login(fullPhone, password, role);
        if (resLogin.success) {
          // Umefanikiwa - usiende OTP tena
          return; // AuthContext itakupeleka Home
        } else {
          // Kama login imeshindwa kwa sababu ya OTP inahitajika, ndio peleka OTP
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
        // KAMA HUNA login FUNCTION - TUMIA OTP TU (kama zamani)
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
      <TouchableOpacity style={styles.langButton} onPress={() => setLangModal(true)}>
        <Text style={styles.langFlag}>{currentLanguage.flag}</Text>
        <Text style={styles.langCode}>{currentLanguage.code.toUpperCase()}</Text>
        <Ionicons name="chevron-down" size={14} color="#4d2b2b" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/icons/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{t('login')}</Text>
      <Text style={styles.subtitle}>{t('welcome_back')} kama {role}</Text>

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

      <Modal visible={langModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLang')}</Text>
            <FlatList
              data={languages}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.langItem, currentLanguage.code === item.code && styles.langItemActive]}
                  onPress={async () => {
                    await setLanguage(item.code);
                    setLangModal(false);
                  }}
                >
                  <Text style={styles.flagBig}>{item.flag}</Text>
                  <Text style={styles.langName}>{item.name}</Text>
                  {currentLanguage.code === item.code && <Ionicons name="checkmark-circle" size={22} color="#264d35" />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setLangModal(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#264d35', padding: 20, paddingTop: 60 },
  langButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  langFlag: { fontSize: 16 },
  langCode: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 12 },
  langItemActive: { backgroundColor: '#e8f5e9' },
  flagBig: { fontSize: 24 },
  langName: { flex: 1, fontSize: 16, fontWeight: '500' },
  modalClose: { marginTop: 15, alignItems: 'center', padding: 10 },
  modalCloseText: { color: '#999', fontWeight: 'bold' }
});