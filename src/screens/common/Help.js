import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

const Help = () => {
  const { t } = useLanguage();

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=+255712345678&text=${encodeURIComponent(t('share_message'))}`;
    Linking.canOpenURL('whatsapp://send').then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(t('error'), t('whatsapp_not_found'));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('help')} & {t('support')}</Text>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>❓ {t('faq')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={openWhatsApp}>
        <Text style={styles.itemText}>💬 WhatsApp {t('support')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>🐛 {t('report_problem')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  item: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 20 },
  itemText: { fontSize: 18 },
});

export default Help;