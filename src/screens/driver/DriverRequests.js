import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { StepButtons } from '../../components/StepButtons';
import { useLanguage } from '../../contexts/LanguageContext';

export default function RequestScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { request } = route?.params || {};
  const [step, setStep] = useState(1);

  const callCustomer = () => {
    Linking.openURL('tel:+255712345678');
  };

  const openMaps = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(request?.pickup || '')}`);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      Alert.alert(t('arrived'), t('arrived_alert_msg'));
    } else if (step === 2) {
      setStep(3);
      navigation.navigate('ActiveTrip', { request });
    }
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('no_request')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <Text style={styles.mapText}>🗺️ {t('map_label')}</Text>
        <Text style={styles.mapHint}>{t('heading_to')} {request.pickup}</Text>
        <TouchableOpacity style={styles.mapBtn} onPress={openMaps}>
          <Text style={styles.mapBtnText}>{t('open_google_maps')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, step >= 1 && styles.statusActive]} />
          <View style={[styles.statusLine, step >= 2 && styles.statusActive]} />
          <View style={[styles.statusDot, step >= 2 && styles.statusActive]} />
          <View style={[styles.statusLine, step >= 3 && styles.statusActive]} />
          <View style={[styles.statusDot, step >= 3 && styles.statusActive]} />
        </View>

        <Text style={styles.title}>
          {step === 1 && t('go_pickup_customer')}
          {step === 2 && t('arrived_place')}
        </Text>

        <View style={styles.customerCard}>
          <Text style={styles.customerName}>👤 {request.customer}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('pickup_lbl')}</Text>
            <Text style={styles.detailValue}>{request.pickup}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('dropoff_lbl')}</Text>
            <Text style={styles.detailValue}>{request.dropoff}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('distance_lbl')}</Text>
            <Text style={styles.detailValue}>{request.distance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('price')}:</Text>
            <Text style={styles.price}>TSh {request.price?.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
          <Text style={styles.callText}>📞 {t('call_customer')}</Text>
        </TouchableOpacity>

        <StepButtons
          onNext={handleNext}
          onBack={() => navigation.goBack()}
          nextText={step === 1? t('arrived') : t('start_trip')}
          backText={t('cancel')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 24, fontWeight: 'bold' },
  mapHint: { fontSize: 16, marginTop: 10, color: '#007AFF' },
  mapBtn: { marginTop: 20, backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  mapBtnText: { color: '#fff', fontWeight: 'bold' },
  info: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  statusBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ddd' },
  statusLine: { flex: 1, height: 3, backgroundColor: '#ddd' },
  statusActive: { backgroundColor: '#4CAF50' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  customerCard: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, marginBottom: 15 },
  customerName: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  detailLabel: { fontSize: 15, color: '#666' },
  detailValue: { fontSize: 15, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 10 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', marginTop: 10 },
  callBtn: { backgroundColor: '#25D366', padding: 15, borderRadius: 8, marginBottom: 15 },
  callText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
