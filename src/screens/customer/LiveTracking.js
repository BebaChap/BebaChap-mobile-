import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import StepButtons from '../../components/StepButtons';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const [showInfo, setShowInfo] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [pickup] = useState('Tabata, Dar es Salaam');
  const [destination, setDestination] = useState('');

  const handleCancel = () => {
    Alert.alert(t('cancel_ride'), t('logout_confirm'), [
      { text: t('no') },
      { text: t('yes_cancel'), style: 'destructive', onPress: () => setIsTracking(false) },
    ]);
  };

  const handleTripComplete = () => {
    setIsTracking(false);
    navigation.getParent()?.navigate('Trips');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -6.7924,
          longitude: 39.2083,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -6.7924, longitude: 39.2083 }} title={t('your_location')} description={pickup} />
        {isTracking && <Marker coordinate={{ latitude: -6.7824, longitude: 39.2183 }} title={t('where_to')} description={destination || 'K/koo'} pinColor="blue" />}
      </MapView>

      {!isTracking && (
        <View style={styles.topContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder={t('where_are_you_going')}
              placeholderTextColor="#999"
              style={styles.input}
              value={destination}
              onChangeText={setDestination}
            />
            <Ionicons name="options" size={20} color="#007AFF" />
          </View>
        </View>
      )}

      {!showInfo && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowInfo(true)}>
          <Text style={styles.fabText}>▲ {t('see_details')}</Text>
        </TouchableOpacity>
      )}

      {showInfo && (
        <View style={styles.bottomCard}>
          <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.handleArea}>
            <View style={styles.line} />
            <Text style={styles.hideTxt}>{t('hide_text')}</Text>
          </TouchableOpacity>

          {!isTracking? (
            <>
              <Text style={styles.title}>{t('welcome_bebachap')}</Text>
              <Text style={styles.sub}>{t('choose_service')}</Text>

              <View style={styles.item}>
                <Text>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{t('nyumbani')}</Text>
                  <Text style={styles.itemSub}>{pickup}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#160606" />
              </View>

              <View style={styles.item}>
                <Text>🛒</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{t('nearby_shop')}</Text>
                  <Text style={styles.itemSub}>{t('spare_open')}</Text>
                </View>
                <View style={styles.open}><Text style={styles.openText}>OPEN</Text></View>
              </View>

              <TouchableOpacity style={styles.btn} onPress={() => setIsTracking(true)}>
                <Text style={styles.btnText}>{t('next')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>{t('driver_on_way')}</Text>
              <Text style={styles.driver}>Juma Dereva • 🏍 T123 ABC</Text>
              <Text style={styles.time}>Dakika 5 • 2.3km</Text>

              <View style={styles.route}>
                <Text style={styles.routeText}>📍 {pickup}</Text>
                <Text style={styles.routeArrow}>↓</Text>
                <Text style={styles.routeText}>🎯 {destination || 'K/koo'}</Text>
              </View>

              <StepButtons onBack={handleCancel} backText={t('cancel_ride')} onNext={handleTripComplete} nextText={t('trip_ended')} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {...StyleSheet.absoluteFillObject },
  topContainer: { position: 'absolute', top: 50, left: 15, right: 15 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 15, padding: 14, gap: 10, elevation: 5,
  },
  input: { flex: 1, color: '#000' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#264d35', borderTopLeftRadius: 25, borderTopRightRadius: 25,
    padding: 20, paddingTop: 8, paddingBottom: 35, elevation: 20,
  },
  handleArea: { alignItems: 'center', paddingBottom: 10 },
  line: { width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 5 },
  hideTxt: { fontSize: 11, color: '#aaa', fontWeight: 'bold' },
  fab: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    backgroundColor: '#111', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 30, elevation: 10,
  },
  fabText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  sub: { color: '#ccc', marginBottom: 15, marginTop: 4 },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    padding: 14, borderRadius: 14, gap: 12, marginBottom: 10,
  },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemSub: { color: '#777', fontSize: 13 },
  open: { backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  openText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  btn: { backgroundColor: '#0d6efd', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  driver: { fontSize: 16, marginTop: 8, marginBottom: 5, color: '#fff' },
  time: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 15 },
  route: { marginBottom: 15 },
  routeText: { fontSize: 16, marginVertical: 4, color: '#fff' },
  routeArrow: { textAlign: 'center', color: '#999' },
});