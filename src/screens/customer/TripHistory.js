import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const TRIPS = [
  { id: '1', from: 'Mlimani', to: 'Posta', price: '3,500', date: '16 Jun 2026', vehicle: '🏍️' },
  { id: '2', from: 'Sinza', to: 'Kariakoo', price: '5,000', date: '15 Jun 2026', vehicle: '🛺' },
];

export default function TripHistory({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safari Zangu</Text>
      <FlatList
        data={TRIPS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.trip}
            onPress={() => navigation?.navigate('TripDetail', { trip: item })}
          >
            <Text style={styles.icon}>{item.vehicle}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.route}>{item.from} → {item.to}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.price}>TSh {item.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Huna safari yoyote bado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  trip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingHorizontal: 20 
  },
  icon: { fontSize: 28, marginRight: 15 },
  route: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 14, color: '#666', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});
