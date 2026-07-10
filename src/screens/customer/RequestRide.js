import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import  StepButtons  from '../../components/StepButtons';

const vehicles = [
  { id: 'boda', name: 'Bodaboda', icon: '🏍️', price: '2,000' },
  { id: 'bajaji', name: 'Bajaji', icon: '🛺', price: '4,000' },
  { id: 'taxi', name: 'Teksi', icon: '🚗', price: '8,000' },
];

export default function RequestRide({ navigation }) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState('boda');
  const [step, setStep] = useState(1);

  const handleRequest = () => {
    if (!pickup || !destination) {
      Alert.alert('Kosa', 'Jaza sehemu zote');
      return;
    }
    Alert.alert('Imefanikiwa', 'Dereva anakuja!', [
      { text: 'OK', onPress: () => navigation.navigate('LiveTracking', { pickup, destination, vehicle }) }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agiza Usafiri</Text>

      <Text style={styles.label}>Unatoka wapi?</Text>
      <TextInput 
        style={styles.input} 
        placeholder="mf: Mlimani City" 
        value={pickup} 
        onChangeText={setPickup} 
      />

      <Text style={styles.label}>Unaenda wapi?</Text>
      <TextInput 
        style={styles.input} 
        placeholder="mf: Posta" 
        value={destination} 
        onChangeText={setDestination} 
      />

      <Text style={styles.label}>Chagua gari</Text>
      {vehicles.map((v) => (
        <TouchableOpacity 
          key={v.id} 
          style={[styles.vehicle, vehicle === v.id && styles.vehicleSelected]} 
          onPress={() => setVehicle(v.id)}
        >
          <Text style={styles.vehicleIcon}>{v.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleName}>{v.name}</Text>
            <Text style={styles.vehiclePrice}>TSh {v.price}</Text>
          </View>
          {vehicle === v.id && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Lipa kwa:</Text>
      <View style={styles.paymentRow}>
        <TouchableOpacity style={styles.payBtn}><Text>M-Pesa</Text></TouchableOpacity>
        <TouchableOpacity style={styles.payBtn}><Text>Tigo Pesa</Text></TouchableOpacity>
        <TouchableOpacity style={styles.payBtn}><Text>Airtel</Text></TouchableOpacity>
      </View>

      <StepButtons 
        onNext={handleRequest} 
        onBack={() => navigation.goBack()} 
        nextText="Agiza Sasa" 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 15, 
    fontSize: 16 
  },
  vehicle: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    marginTop: 10 
  },
  vehicleSelected: { borderColor: '#007AFF', backgroundColor: '#E3F2FD' },
  vehicleIcon: { fontSize: 32, marginRight: 15 },
  vehicleName: { fontSize: 18, fontWeight: 'bold' },
  vehiclePrice: { fontSize: 14, color: '#666' },
  check: { fontSize: 22, color: '#007AFF', fontWeight: 'bold' },
  paymentRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  payBtn: { 
    flex: 1, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
});