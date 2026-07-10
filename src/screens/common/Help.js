import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const Help = () => {
  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+255712345678&text=Nahitaji msaada RideSuperApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Msaada & Support</Text>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>❓ Maswali ya Kawaida</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={openWhatsApp}>
        <Text style={styles.itemText}>💬 WhatsApp Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>🐛 Ripoti Tatizo</Text>
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
Linking.canOpenURL('whatsapp://send?phone=+255712345678').then(supported => {
  if (supported) {
    Linking.openURL('whatsapp://send?phone=+255712345678&text=Nahitaji msaada SafariGOApp');
  } else {
    Alert.alert('Kosa', 'WhatsApp haijafungwa kwenye simu yako');
  }
});