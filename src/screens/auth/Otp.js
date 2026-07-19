import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// Roles halali tu - admin hairuhusiwi
const ALLOWED_ROLES = ['customer', 'driver', 'vendor', 'garage'];

export default function Otp({ navigation, route }) {
  const { name = '', phone = '', role = 'customer', isLogin = false } = route.params || {};
  const [otp, setOtp] = useState('');
  const { verifyOtp, loading, tempPhone } = useAuth();
  
  const displayPhone = phone || tempPhone || '';

  // Linda system - kama mtu amejaribu ku-inject admin
  const safeRole = ALLOWED_ROLES.includes(role) ? role : 'customer';

  console.log('>>> OTP SCREEN: role =', safeRole, '| phone =', displayPhone, '| isLogin:', isLogin);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Kosa', 'OTP lazima iwe tarakimu 6');
      return;
    }

    console.log('>>> NINATUMA verifyOtp na role:', safeRole);
    
    const result = await verifyOtp(otp, {
      name: name || 'User',
      phone: displayPhone,
      role: safeRole
    });

    console.log('>>> RESULT:', result);

    if (result.success) {
      // USIFANYE navigation.navigate - AppNavigator itabadilisha yenyewe
      // Alert tu
      if (!isLogin) {
        Alert.alert('Hongera!', `Umejisajili kama ${safeRole.toUpperCase()}`);
      }
    } else {
      Alert.alert('Kosa', result.message || 'OTP sio sahihi');
      setOtp('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Badili Namba</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Weka OTP</Text>
      <Text style={styles.subtitle}>
        Tumetuma code kwenye {displayPhone}{'\n'}
        {name ? `Jina: ${name} | ` : ''}Role: {safeRole.toUpperCase()}
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="123456"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        autoFocus
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity
        style={[styles.button, (loading || otp.length < 6) && styles.buttonDisabled]}
        onPress={handleVerifyOtp}
        disabled={loading || otp.length < 6}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Thibitisha</Text>}
      </TouchableOpacity>

      <Text style={styles.hint}>Weka namba 6 yoyote (mfano 123456)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  backBtn: { position: 'absolute', top: 60, left: 20 },
  backText: { fontSize: 16, color: '#007aff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 30, lineHeight: 22 },
  otpInput: { borderWidth: 2, borderColor: '#007aff', borderRadius: 12, fontSize: 24, textAlign: 'center', letterSpacing: 12, paddingVertical: 15, marginBottom: 20, backgroundColor:'#f9f9f9' },
  button: { backgroundColor: '#007aff', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hint: { textAlign: 'center', marginTop: 20, color: '#999', fontSize: 13 },
});