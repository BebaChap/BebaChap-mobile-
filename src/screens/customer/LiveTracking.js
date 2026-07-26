import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import StepButtons from '../../components/StepButtons';

export default function LiveTracking({ navigation, route }) {
  const { pickup, destination } = route?.params || {};

  const handleCancel = () => {
    Alert.alert('Ghairi Safari', 'Una uhakika?', [
      { text: 'Hapana' },
      { text: 'Ndio Ghairi', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  // --- FUNCTION MPYA BILA KUHARIBU LOGIC ---
  const handleTripComplete = () => {
    // HII NDIO FIX YA ERROR YAKO
    navigation.getParent()?.navigate('Trips');
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.info}>
        <Text style={styles.title}>Dereva Anakuja</Text>
        <Text style={styles.driver}>Juma Dereva • 🏍 T123 ABC</Text>
        <Text style={styles.time}>Dakika 5 • 2.3km</Text>
        
        <View style={styles.route}>
          <Text style={styles.routeText}>📍 {pickup || 'Kimara'}</Text>
          <Text style={styles.routeArrow}>↓</Text>
          <Text style={styles.routeText}>🎯 {destination || 'K/koo'}</Text>
        </View>

        {/* --- BUTTONS ZILIZOREKEBISHWA --- */}
        <StepButtons onBack={handleCancel} backText="Ghairi Safari" onNext={handleTripComplete} nextText="Safari Imeisha" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  info: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  driver: { fontSize: 16, marginBottom: 5 },
  time: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 20 },
  route: { marginBottom: 20 },
  routeText: { fontSize: 16, marginVertical: 5 },
  routeArrow: { fontSize: 20, textAlign: 'center', color: '#999' },
});