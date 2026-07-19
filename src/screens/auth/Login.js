import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import StepButtons from '../../components/StepButtons';
import { Ionicons } from '@expo/vector-icons'; // <--- 1. ONGEZA HII

export default function Login({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { sendOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <--- 2. STATE YA KUFICHA/KUONYESHA
  const [loading, setLoading] = useState(false);
  const role = route.params?.role || 'customer';

  const handleNext = async () => {
    if (!phone.trim()) {
      Alert.alert('Kosa', 'Tafadhali ingiza namba ya simu');
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
      <Text style={styles.title}>Ingia</Text>
      <Text style={styles.subtitle}>Karibu tena! Ingiza taarifa zako</Text>

      <Text style={styles.label}>Namba ya Simu</Text>
      <TextInput 
        placeholder="0717084080"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#999"
      />

      {/* --- 3. PASSWORD NA EYE ICON --- */}
      <Text style={styles.label}>Nenosiri</Text>
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
        <Text style={styles.forgotText}>Umesahau nenosiri?</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" color="#007aff" /> : (
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
          Huna akaunti? <Text style={styles.registerLink}>Jisajili</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#264d35', padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#ffffff' },
  subtitle: { fontSize: 16, color: '#ffffff', marginBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 16, marginBottom: 20, borderRadius: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  // --- 4. STYLE MPYA ---
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#080404', 
    borderRadius: 12, 
    backgroundColor: '#f9f9f9',
    marginBottom: 20
  },
  inputPassword: { flex: 1, padding: 16, fontSize: 16 },
  eyeIcon: { padding: 12 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#007aff', fontSize: 14, fontWeight: '500' },
  registerButton: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 15, color: '#666' },
  registerLink: { color: '#007aff', fontWeight: '600' },
});