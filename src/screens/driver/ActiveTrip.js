import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StepButtons } from '../../components/StepButtons';

export default function ActiveTrip({ route, navigation }) {
  const { request } = route?.params || {};
  const [distance, setDistance] = useState(0.0);
  const [time, setTime] = useState(0);
  const [step, setStep] = useState(1); // 1=safari inaendelea, 2=umefika

  // simulate trip progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(prev => +(prev + 0.1).toFixed(1));
      setTime(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const completeTrip = () => {
    Alert.alert(
      'Maliza Safari',
      `Umepokea TSh ${request?.price?.toLocaleString() || '0'}`,
      [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
    );
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hakuna safari</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <Text style={styles.mapText}>🗺️ Unaendesha</Text>
        <Text style={styles.mapHint}>Kwenda: {request.dropoff}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>Safari Inaendelea</Text>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{distance} km</Text>
            <Text style={styles.statLabel}>Umbali</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{time} dk</Text>
            <Text style={styles.statLabel}>Muda</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>TSh {request.price?.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Bei</Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>👤 {request.customer}</Text>
          <Text style={styles.routeText}>🎯 {request.dropoff}</Text>
        </View>

        <StepButtons
          onNext={completeTrip}
          nextText="Maliza Safari"
          onBack={() => Alert.alert('Tahadhari', 'Huwezi kughairi safari iliyoanza')}
          backText="Ghairi"
          disableNext={false}
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
  info: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 10, 
    marginHorizontal: 5 
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  customerInfo: { 
    backgroundColor: '#f5f5f5', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20 
  },
  customerName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  routeText: { fontSize: 16, color: '#333' },
});