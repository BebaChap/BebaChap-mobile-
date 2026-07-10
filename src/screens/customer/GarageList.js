import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const services = [
  { id: '1', name: 'Kubadilisha Oil', price: '25,000', icon: '🛢️' },
  { id: '2', name: 'Tire/Bili', price: '15,000', icon: '🛞' },
  { id: '3', name: 'Engine Check', price: '50,000', icon: '🔧' },
];

export default function GarageList({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huduma za Gereji</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.service} 
            onPress={() => navigation.navigate('BookService', { item })}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Kuanzia TSh {item.price}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  service: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingHorizontal: 20 
  },
  icon: { fontSize: 32, marginRight: 15 },
  name: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
  arrow: { fontSize: 28, color: '#ccc' },
});