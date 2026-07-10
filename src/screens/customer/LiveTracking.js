import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StepButtons } from '../../components/StepButtons';

export default function LiveTracking({ navigation, route }) {
  const { pickup, destination, vehicle } = route?.params || {};

  const handleCancel = () => {
    Alert.alert('Ghairi Safari', 'Una uhakika?', [
      { text: 'Hapana' },
      { text: 'Ndio Ghairi', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <Text style={styles.mapText}>🗺️ Ramani Hapa</Text>
        <Text style={styles.mapHint}>integrate: react-native-maps</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>Dereva Anakuja</Text>
        <Text style={styles.driver}>Juma Dereva • 🏍️ T123 ABC</Text>
        <Text style={styles.time}>Dakika 5 • 2.3km</Text>
        
        <View style={styles.route}>
          <Text style={styles.routeText}>📍 {pickup || 'Mlimani City'}</Text>
          <Text style={styles.routeArrow}>↓</Text>
          <Text style={styles.routeText}>🎯 {destination || 'Posta'}</Text>
        </View>

        <StepButtons onBack={handleCancel} backText="Ghairi Safari" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 24, fontWeight: 'bold' },
  mapHint: { fontSize: 12, color: '#666', marginTop: 10 },
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