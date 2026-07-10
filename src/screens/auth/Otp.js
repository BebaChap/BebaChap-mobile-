import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function Otp({ navigation, route }) {
  const { name = '', phone = '', role = 'customer' } = route.params || {};
  const [otp, setOtp] = useState('');
  const { verifyOtp, loading, tempPhone } = useAuth();
  const displayPhone = phone || tempPhone;

  // ONA HAPA - itaonyesha kwenye log
  console.log('>>> OTP SCREEN: role =', role, '| phone =', displayPhone);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Kosa', 'OTP lazima iwe tarakimu 6');
      return;
    }

    console.log('>>> NINATUMA verifyOtp na role:', role);
    
    const result = await verifyOtp(otp, {
      name,
      phone: displayPhone,
      role
    });

    console.log('>>> RESULT:', result.user);

    if (result.success) {
      Alert.alert('Hongera!', `Umejisajili kama ${role.toUpperCase()}`);
      // Usinavigate — AppNavigator itabadilisha yenyewe kulingana na role
    } else {
      Alert.alert('Kosa', result.message);
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
        Jina: {name} | Role: {role.toUpperCase()}
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="123456"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        autoFocus
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
  otpInput: { borderWidth: 2, borderColor: '#007aff', borderRadius: 8, fontSize: 24, textAlign: 'center', letterSpacing: 12, paddingVertical: 15, marginBottom: 20 },
  button: { backgroundColor: '#007aff', padding: 18, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hint: { textAlign: 'center', marginTop: 20, color: '#999', fontSize: 14 },
});