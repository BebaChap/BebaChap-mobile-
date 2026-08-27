import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert, Linking } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

const ShareApp = () => {
  const { t } = useLanguage();

  const shareToWhatsApp = async () => {
    try {
      const result = await Share.share({
        message: t('share_message'),
        title: 'Beba Chap',
      });

      if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert(t('error'), t('share_failed'));
    }
  };

  const openWhatsAppDirect = () => {
    const message = t('share_message');
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(t('error'), t('whatsapp_not_found'));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('share_app')}</Text>
      <Text style={styles.desc}>{t('share_desc')}</Text>

      <TouchableOpacity style={styles.button} onPress={shareToWhatsApp}>
        <Text style={styles.buttonText}>📱 {t('share_via_apps')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.waButton]} onPress={openWhatsAppDirect}>
        <Text style={styles.buttonText}>💬 {t('open_whatsapp')}</Text>
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
