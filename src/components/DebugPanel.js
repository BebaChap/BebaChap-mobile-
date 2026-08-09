import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { logAllStorage, clearAllStorage } from '../utils/DebugUtils';

export default function DebugPanel({ navigation, user }) {
  const [visible, setVisible] = useState(false);
  const [storage, setStorage] = useState({});
  const { language, t } = useLanguage();

  const refresh = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    const obj = {};
    values.forEach(([k, v]) => {
      obj[k] = v;
    });
    setStorage(obj);
  };

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, language]);

  if (!visible) {
    return (
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <Text style={styles.fabText}>BUG</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.box}>
        <Text style={styles.title}>🔍 DEBUG PANEL</Text>

        <Text style={styles.label}>Lugha ya Sasa:</Text>
        <Text style={styles.value}>{`${language} -> ${t('shop_profile')}`}</Text>

        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>
          {user? JSON.stringify(user).slice(0, 100) : 'NULL (Haja-login)'}
        </Text>

        <Text style={styles.label}>Current Route:</Text>
        <Text style={styles.value}>
          {navigation?.getState?.()?.routes?.slice(-1)[0]?.name || 'Unknown'}
        </Text>

        <Text style={styles.label}>AsyncStorage:</Text>
        {Object.entries(storage).map(([k, v]) => (
          <Text key={k} style={styles.storageText}>
            {`${k}: ${String(v)}`}
          </Text>
        ))}

        <TouchableOpacity style={styles.btn} onPress={refresh}>
          <Text style={styles.btnText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: 'orange' }]} onPress={logAllStorage}>
          <Text style={styles.btnText}>Log Storage kwenye Console</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: 'red' }]}
          onPress={async () => {
            await clearAllStorage();
            refresh();
          }}
        >
          <Text style={styles.btnText}>FUTA STORAGE YOTE (Reset App)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: '#000' }]} onPress={() => setVisible(false)}>
          <Text style={styles.btnText}>Funga X</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 100, right: 20, backgroundColor: 'red', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', zIndex: 9999, elevation: 10 },
  fabText: { color: '#fff', fontWeight: 'bold' },
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, paddingTop: 50, padding: 20 },
  box: { backgroundColor: '#fff', borderRadius: 12, padding: 15, maxHeight: '90%' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  label: { fontWeight: 'bold', marginTop: 10, color: '#007aff' },
  value: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 6, marginBottom: 5 },
  storageText: { fontSize: 12, fontFamily: 'monospace', marginBottom: 2 },
  btn: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});