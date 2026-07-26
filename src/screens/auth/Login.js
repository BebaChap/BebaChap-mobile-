import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, FlatList, Image } from 'react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import StepButtons from '../../components/StepButtons';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation, route }) {
  const { t, currentLanguage, languages, changeLanguage } = useContext(LanguageContext);
  const { sendOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const role = route.params?.role || 'customer';

  const handleNext = async () => {
    if (!phone.trim()) {
      Alert.alert('Kosa', t('enter_phone') || 'Tafadhali ingiza namba ya simu');
      return;
    }

    // Kama password ipo lakini ni login ya OTP - tunaendelea na OTP (logic yako ya awali)
    if (phone.trim().length < 9) {
      Alert.alert('Kosa', 'Namba ya simu sio sahihi');
      return;
    }
    
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = cleanPhone.startsWith('255') ? `+${cleanPhone}` : `+255${cleanPhone.replace(/^0+/, '')}`;
      
      const res = await sendOtp(fullPhone);
      
      if (res.success) {
        navigation.navigate('OTP', { 
          phone: fullPhone,
          role: role,
          isLogin: true,
          name: ''
        });
      } else {
        Alert.alert('Imeshindikana', res.message || 'Jaribu tena');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Imeshindikana', 'Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langButton} onPress={() => setLangModal(true)}>
        <Text style={styles.langFlag}>{currentLanguage.flag}</Text>
        <Text style={styles.langCode}>{currentLanguage.code.toUpperCase()}</Text>
        <Ionicons name="chevron-down" size={14} color="#fff" />
      </TouchableOpacity>

      <Image 
        source={require('../../../assets/icons/icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{t('login') || 'Ingia'}</Text>
      <Text style={styles.subtitle}>{t('welcome_back') || 'Karibu tena! Ingiza taarifa zako'}</Text>

      <Text style={styles.label}>{t('phone') || 'Namba ya Simu'}</Text>
      <TextInput 
        placeholder="07167084080"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>{t('password') || 'Nenosiri'}</Text>
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
            name={showPassword ? "eye-off" : "eye"} 
            size={22} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.forgotButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotText}>{t('forgot_password') || 'Umesahau nenosiri?'}</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" color="#fff" /> : (
        <StepButtons 
          onNext={handleNext}
          nextText={t('next') || 'Endelea'}
        />
      )}

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register', { role })}
      >
        <Text style={styles.registerText}>
          {t('no_account') || 'Huna akaunti?'} <Text style={styles.registerLink}>{t('register') || 'Jisajili'}</Text>
        </Text>
      </TouchableOpacity>

      <Modal visible={langModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLang') || 'Chagua Lugha'}</Text>
            <FlatList
              data={languages}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.langItem, currentLanguage.code === item.code && styles.langItemActive]}
                  onPress={async () => {
                    await changeLanguage(item.code);
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
              <Text style={styles.modalCloseText}>Funga</Text>
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
  subtitle: { fontSize: 16, color: '#ffffff', marginBottom: 30 },
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