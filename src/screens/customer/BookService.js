import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import  StepButtons  from '../../components/StepButtons';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookService({ route, navigation }) {
  const { t } = useLanguage();
  const { item } = route?.params || {};
  const [date, setDate] = useState('Leo 2:00 PM');

  const book = () => {
    Alert.alert(t('saved'), t('service_saved_msg', { name: item?.name, date }), [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('no_service_selected')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('save_service')}</Text>
      <View style={styles.card}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>TSh {item.price}</Text>
      </View>

      <Text style={styles.label}>{t('choose_time')}</Text>
      <TouchableOpacity style={styles.timeBtn}>
        <Text style={styles.timeText}>{date}</Text>
      </TouchableOpacity>

      <Text style={styles.note}>{t('deposit_note')}</Text>

      <StepButtons onNext={book} onBack={() => navigation.goBack()} nextText={t('pay_deposit')} />
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
