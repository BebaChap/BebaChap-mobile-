import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ForgotPassword({ navigation }) {
  const [phone, setPhone] = useState('');

  const handleReset = () => {
    if (phone.length < 9) {
      Alert.alert('Kosa', 'Weka namba sahihi');
      return;
    }
    Alert.alert('OTP Imetumwa', 'Weka OTP kutengeneza nenosiri jipya');
    navigation.navigate('OTP'); // reuse otp screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sahau Nenosiri</Text>
      <Text style={styles.subtitle}>Weka namba yako tutakutumia OTP</Text>
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
        <Text style={styles.buttonText}>Tuma OTP</Text>
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