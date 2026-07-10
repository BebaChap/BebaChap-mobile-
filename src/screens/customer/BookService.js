import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import  StepButtons  from '../../components/StepButtons';

export default function BookService({ route, navigation }) {
  const { item } = route?.params || {};
  const [date, setDate] = useState('Leo 2:00 PM');

  const book = () => {
    Alert.alert('Imehifadhiwa', `Huduma ya ${item?.name} imehifadhiwa ${date}. Deposit: TSh 10,000`, [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kosa: Hakuna huduma iliyochaguliwa</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hifadhi Huduma</Text>
      <View style={styles.card}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>TSh {item.price}</Text>
      </View>

      <Text style={styles.label}>Chagua Muda</Text>
      <TouchableOpacity style={styles.timeBtn}>
        <Text style={styles.timeText}>{date}</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Deposit ya TSh 10,000 italipwa kwa M-Pesa</Text>

      <StepButtons onNext={book} onBack={() => navigation.goBack()} nextText="Lipa Deposit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#f5f5f5', padding: 30, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  icon: { fontSize: 60, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold' },
  price: { fontSize: 18, color: '#007AFF', marginTop: 5 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  timeBtn: { borderWidth: 1, borderColor: '#ddd', padding: 18, borderRadius: 8, marginBottom: 20 },
  timeText: { fontSize: 16 },
  note: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
});