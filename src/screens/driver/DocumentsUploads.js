import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function DocumentsUpload({ navigation }) {
  const [docs, setDocs] = useState({
    license: false,
    insurance: false,
    vehicle: false,
  });

  const uploadDoc = (type) => {
    Alert.alert('Upload', `Chagua picha ya ${type}`, [
      { text: 'Ghairi' },
      { text: 'Piga Picha', onPress: () => setDocs({...docs, [type]: true }) },
      { text: 'Chagua Gallery', onPress: () => setDocs({...docs, [type]: true }) },
    ]);
  };

  const submitDocs = () => {
    if (!docs.license ||!docs.insurance ||!docs.vehicle) {
      Alert.alert('Kosa', 'Tafadhali pakia nyaraka zote');
      return;
    }
    Alert.alert('Imefanikiwa', 'Nyaraka zimewasilishwa. Tunasubiri verification.', [
      { text: 'OK', onPress: () => navigation?.navigate('Dashboard') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pakia Nyaraka</Text>
      <Text style={styles.subtitle}>Tunahitaji nyaraka hizi kuthibitisha akaunti yako</Text>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>📄</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>Leseni ya Udereva</Text>
          <Text style={styles.docStatus}>{docs.license? '✓ Imepakuliwa' : 'Haijapakuliwa'}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('license')}>
          <Text style={styles.uploadText}>{docs.license? 'Badili' : 'Pakia'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>🛡️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>Bima ya Gari</Text>
          <Text style={styles.docStatus}>{docs.insurance? '✓ Imepakuliwa' : 'Haijapakuliwa'}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('insurance')}>
          <Text style={styles.uploadText}>{docs.insurance? 'Badili' : 'Pakia'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docCard}>
        <Text style={styles.docIcon}>🚗</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>Picha ya Gari</Text>
          <Text style={styles.docStatus}>{docs.vehicle? '✓ Imepakuliwa' : 'Haijapakuliwa'}</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadDoc('vehicle')}>
          <Text style={styles.uploadText}>{docs.vehicle? 'Badili' : 'Pakia'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={submitDocs}>
        <Text style={styles.submitText}>Wasilisha Nyaraka</Text>
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