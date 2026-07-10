import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert, Linking } from 'react-native';

const ShareApp = () => {
  const shareToWhatsApp = async () => {
    try {
      const result = await Share.share({
        message: 'Safari GO! Usafiri, Duka, Gereji - vyote kwa moja. https://ridesuperapp.com',
        title: 'RideSuperApp',
      });

      if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Kosa', 'Imeshindikana kushare');
    }
  };

  const openWhatsAppDirect = () => {
    const message = 'Safari GO! Usafiri, Duka, Gereji - vyote kwa moja. https://ridesuperapp.com';
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Kosa', 'WhatsApp haijafungwa kwenye simu yako');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share App</Text>
      <Text style={styles.desc}>Waambie marafiki wako kuhusu RideSuperApp</Text>
      
      <TouchableOpacity style={styles.button} onPress={shareToWhatsApp}>
        <Text style={styles.buttonText}>📱 Share kwa Apps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.waButton]} onPress={openWhatsAppDirect}>
        <Text style={styles.buttonText}>💬 Fungua WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#007aff', padding: 18, borderRadius: 8, width: '100%', marginBottom: 15 },
  waButton: { backgroundColor: '#25D366' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default ShareApp;