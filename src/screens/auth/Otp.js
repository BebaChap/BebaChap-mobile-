import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ALLOWED_ROLES = ['customer', 'driver', 'vendor', 'garage'];

export default function Otp({ navigation, route }) {
  const { name = '', phone = '', role = 'customer', vendorType = 'shop', isLogin = false } = route.params || {};
  const [otp, setOtp] = useState('');
  const { verifyOtp, loading, tempPhone } = useAuth();
  const { t } = useLanguage();
  
  const displayPhone = phone || tempPhone || '';
  const safeRole = ALLOWED_ROLES.includes(role) ? role : 'customer';
  const safeVendorType = ['shop', 'restaurant'].includes(vendorType) ? vendorType : 'shop';

  console.log('>>> OTP SCREEN: role =', safeRole, '| vendorType =', safeVendorType, '| phone =', displayPhone);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert(t('error'), t('otp_required'));
      return;
    }

    console.log('>>> NINATUMA verifyOtp na role:', safeRole, 'vendorType:', safeVendorType);

    const result = await verifyOtp(otp, {
      name: name || 'User',
      phone: displayPhone,
      role: safeRole,
      vendorType: safeVendorType
    });

    console.log('>>> RESULT:', result);

    if (result.success) {
      if (!isLogin) {
        const typeLabel = safeRole === 'vendor' ? (safeVendorType === 'restaurant' ? 'RESTAURANT' : 'DUKA') : safeRole.toUpperCase();
        Alert.alert(t('congrats') + '!', `${t('registered_as')} ${typeLabel}`);
      }
    } else {
      Alert.alert(t('error'), result.message || t('otp_invalid'));
      setOtp('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← {t('change_number')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('enter_otp')}</Text>
      <Text style={styles.subtitle}>
        {`${t('otp_sent_to')} ${displayPhone}`}{'\n'}
        {name ? `${t('full_name')}: ${name} | ` : ''}{t('role')}: {safeRole.toUpperCase()}
        {safeRole === 'vendor' ? ` (${safeVendorType === 'restaurant' ? `🍽️ ${t('restaurant_fastfood')}` : `🛒 ${t('shop_title')}`})` : ''}
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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('confirm')}</Text>}
      </TouchableOpacity>

      <Text style={styles.hint}>{t('otp_hint_dev')}</Text>
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