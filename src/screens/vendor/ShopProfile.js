import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function ShopProfile({ navigation }) {
  const [shopName, setShopName] = useState('Juma Store');
  const [location, setLocation] = useState('Sinza, Dar es Salaam');
  const [hours, setHours] = useState('8:00 AM - 9:00 PM');
  const [phone, setPhone] = useState('+255712345678');
  const [desc, setDesc] = useState('Tunauza bidhaa bora za chakula kwa bei nafuu');

  const saveProfile = () => {
    if (!shopName ||!location ||!phone) {
      Alert.alert('Kosa', 'Tafadhali jaza jina la biashara, eneo na namba ya simu');
      return;
    }
    Alert.alert('Imehifadhiwa', 'Profile ya duka imehaririwa', [
      { text: 'OK', onPress: () => navigation?.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile ya Duka</Text>

      <View style={styles.photoBox}>
        <Text style={styles.photoIcon}>🏪</Text>
        <TouchableOpacity style={styles.changePhotoBtn}>
          <Text style={styles.changePhotoText}>Badili Picha</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Jina la Biashara</Text>
      <TextInput style={styles.input} value={shopName} onChangeText={setShopName} />

      <Text style={styles.label}>Eneo</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Saa za Kazi</Text>
      <TextInput style={styles.input} value={hours} onChangeText={setHours} />

      <Text style={styles.label}>Namba ya Simu</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Maelezo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>Hifadhi Mabadiliko</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 25 },
  photoBox: { alignItems: 'center', marginBottom: 30 },
  photoIcon: { fontSize: 80, marginBottom: 15 },
  changePhotoBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  changePhotoText: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8, paddingHorizontal: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, marginHorizontal: 20 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#007AFF', margin: 20, padding: 18, borderRadius: 8, marginTop: 30 },
  saveText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});