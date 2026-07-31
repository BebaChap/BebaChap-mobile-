import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import StepButtons from '../../components/StepButtons';

export default function LiveTracking({ navigation, route }) {
  const { pickup, destination } = route?.params || {};
  const [isInfoVisible, setIsInfoVisible] = useState(true);

  const handleCancel = () => {
    Alert.alert('Ghairi Safari', 'Una uhakika?', [
      { text: 'Hapana' },
      { text: 'Ndio Ghairi', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const handleTripComplete = () => {
    navigation.getParent()?.navigate('Trips');
  };

  return (
    <View style={styles.container}>
      {/* MAP FULL SCREEN */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -6.7924, // Dar
          longitude: 39.2083,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -6.7924, longitude: 39.2083 }} title="Uko Hapa" description={pickup || 'Kimara'} />
        <Marker coordinate={{ latitude: -6.7824, longitude: 39.2183 }} title="Unakoenda" description={destination || 'K/koo'} pinColor="blue" />
      </MapView>

      {/* BUTTON YA KUFUNGUA MAELEZO IKIWA IMEFICHWA */}
      {!isInfoVisible && (
        <TouchableOpacity style={styles.showButton} onPress={() => setIsInfoVisible(true)}>
          <Text style={styles.showButtonText}>Ona Maelezo ▲</Text>
        </TouchableOpacity>
      )}

      {/* INFO BOTTOM SHEET - INAWEZA KUFICHWA */}
      {isInfoVisible && (
        <View style={styles.info}>
          {/* KISHIKIO CHA KUBURUTA */}
          <TouchableOpacity style={styles.handleContainer} onPress={() => setIsInfoVisible(false)}>
            <View style={styles.handle} />
            <Text style={styles.hideText}>Ficha ▼</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Dereva Anakuja</Text>
          <Text style={styles.driver}>Juma Dereva • 🏍 T123 ABC</Text>
          <Text style={styles.time}>Dakika 5 • 2.3km</Text>
          
          <View style={styles.route}>
            <Text style={styles.routeText}>📍 {pickup || 'Kimara'}</Text>
            <Text style={styles.routeArrow}>↓</Text>
            <Text style={styles.routeText}>🎯 {destination || 'K/koo'}</Text>
          </View>

          <StepButtons onBack={handleCancel} backText="Ghairi Safari" onNext={handleTripComplete} nextText="Safari Imeisha" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff'
  },
  map: { 
    ...StyleSheet.absoluteFillObject, // HII NDIO INAYOFANYA FULL SCREEN
  },
  info: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', 
    padding: 20, 
    paddingTop: 10,
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
    maxHeight: '60%', // Isiscroll ndani kama ni ndefu
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    marginBottom: 6,
  },
  hideText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600'
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  driver: { fontSize: 16, marginBottom: 5 },
  time: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 20 },
  route: { marginBottom: 20 },
  routeText: { fontSize: 16, marginVertical: 5 },
  routeArrow: { fontSize: 20, textAlign: 'center', color: '#999' },
  showButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 10,
  },
  showButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});