import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ForgotPassword({ navigation }) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');

  const handleReset = () => {
    if (phone.length < 9) {
      Alert.alert(t('error'), t('enter_valid_phone'));
      return;
    }
    Alert.alert(t('otp_sent'), t('otp_sent_message'));
    navigation.navigate('OTP');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forgot_password_title')}</Text>
      <Text style={styles.subtitle}>{t('forgot_password_subtitle')}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+255</Text>
        <TextInput
          style={styles.input}
          placeholder="712345678"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={9}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>{t('send_otp')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20, paddingHorizontal: 15 },
  prefix: { fontSize: 18, fontWeight: '600', marginRight: 10 },
  input: { flex: 1, fontSize: 18, paddingVertical: 15 },
  button: { backgroundColor: '#007aff', padding: 18, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
