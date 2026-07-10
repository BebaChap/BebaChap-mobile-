import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext'; // <-- BADILISHA HAPA
import StepButtons from '../../components/StepButtons';

export default function Login({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { sendOtp, login } = useAuth(); // <-- tumia hizi
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const role = route.params?.role || 'customer';

  const handleNext = async () => {
    if (!phone) {
      Alert.alert('Kosa', 'Tafadhali ingiza namba ya simu');
      return;
    }
    
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = cleanPhone.startsWith('255') ? `+${cleanPhone}` : `+255${cleanPhone.replace(/^0+/, '')}`;
      
      // Tumia sendOtp kutoka AuthContext (sio loginCustomer)
      const res = await sendOtp(fullPhone);
      
      if (res.success) {
        // Pitisha role kwenda OTP
        navigation.navigate('OTP', { 
          phone: fullPhone,
          role: role, // <-- muhimu
          isLogin: true 
        });
      } else {
        Alert.alert('Imeshindikana', res.message);
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Imeshindikana', 'Jaribu tena.');
    }
  };

  // ONGEZA HAPA - bila kuathiri code nyingine
  const handleSendOtp = async () => {
    await sendOtp(phone);
    console.log('NAVIGATING TO OTP...');
    navigation.navigate('OTP', { role, phone }); // role lazima itoke kwenye route.params
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Kwa login ya email/password (hiari)
  const handleEmailLogin = async () => {
    if (!phone || !password) return;
    const res = await login(phone, password); // login ya AuthContext
    if (res.success) navigation.replace('Home');
    else Alert.alert('Login Failed', res.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingia</Text>
      <Text style={styles.subtitle}>Karibu tena! Ingiza taarifa zako</Text>

      <Text style={styles.label}>Namba ya Simu</Text>
      <TextInput 
        placeholder="0712345678"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Nenosiri (hiari)</Text>
      <TextInput 
        placeholder="Ingiza nenosiri"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity 
        style={styles.forgotButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotText}>Umesahau nenosiri?</Text>
      </TouchableOpacity>

      <StepButtons 
        onNext={handleNext}
        onBack={handleBack}
        nextText={t('next') || 'Endelea'}
        backText={t('back') || 'Rudi'}
      />

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register', { role })}
      >
        <Text style={styles.registerText}>
          Huna akaunti? <Text style={styles.registerLink}>Jisajili</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 16, marginBottom: 20, borderRadius: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#007aff', fontSize: 14, fontWeight: '500' },
  registerButton: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 15, color: '#666' },
  registerLink: { color: '#007aff', fontWeight: '600' },
});