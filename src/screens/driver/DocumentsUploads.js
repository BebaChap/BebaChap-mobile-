import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DocumentsUpload({ navigation }) {
  const { t } = useLanguage();
  const [docs, setDocs] = useState({
    license: false,
    insurance: false,
    vehicle: false,
  });

  const uploadDoc = (type) => {
    Alert.alert(t('upload_btn'), t('choose_photo_of', { type }), [
      { text: t('cancel') },
      { text: t('take_photo'), onPress: () => setDocs({...docs, [type]: true }) },
      { text: t('choose_gallery'), onPress: () => setDocs({...docs, [type]: true }) },
    ]);
  };

  const submitDocs = () => {
    if (!docs.license ||!docs.insurance ||!docs.vehicle) {
      Alert.alert(t('error'), t('upload_all_first'));
      return;
    }
    Alert.alert(t('success'), t('docs_submitted'), [
      { text: 'OK', onPress: () => navigation?.navigate('Dashboard') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('attach_documents')}</Text>
      <Text style={styles.subtitle}>{t('docs_needed')}</Text>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>📄</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>{t('driving_license')}</Text>
          <Text style={styles.docStatus}>{docs.license? `✓ ${t('uploaded')}` : t('not_uploaded')}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('license')}>
          <Text style={styles.uploadText}>{docs.license? t('replace_btn') : t('upload_btn')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>🛡️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>{t('vehicle_insurance')}</Text>
          <Text style={styles.docStatus}>{docs.insurance? `✓ ${t('uploaded')}` : t('not_uploaded')}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('insurance')}>
          <Text style={styles.uploadText}>{docs.insurance? t('replace_btn') : t('upload_btn')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>🚗</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>{t('vehicle_photo')}</Text>
          <Text style={styles.docStatus}>{docs.vehicle? `✓ ${t('uploaded')}` : t('not_uploaded')}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('vehicle')}>
          <Text style={styles.uploadText}>{docs.vehicle? t('replace_btn') : t('upload_btn')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={submitDocs}>
        <Text style={styles.submitText}>{t('submit_docs')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', paddingHorizontal: 20, marginBottom: 30 },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12
  },
  docIcon: { fontSize: 40, marginRight: 15 },
  docTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  docStatus: { fontSize: 14, color: '#666' },
  uploadBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  uploadText: { color: '#fff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#4CAF50', margin: 20, padding: 18, borderRadius: 8 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
