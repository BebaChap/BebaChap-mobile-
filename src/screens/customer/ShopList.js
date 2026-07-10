import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const products = [
  { id: '1', name: 'Mchele 5kg', price: '12,000', image: '🍚' },
  { id: '2', name: 'Mafuta 1L', price: '8,000', image: '🛢️' },
  { id: '3', name: 'Sukari 2kg', price: '6,000', image: '🍬' },
];

export default function ShopList({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duka</Text>
      <TextInput style={styles.search} placeholder="Tafuta bidhaa..." />
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.product} 
            onPress={() => navigation.navigate('ProductDetail', { item })}
          >
            <Text style={styles.emoji}>{item.image}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>TSh {item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 15 },
  search: { 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    fontSize: 16
  },
  product: { 
    flex: 1, 
    backgroundColor: '#fff', 
    margin: 10, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  emoji: { fontSize: 50, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  price: { fontSize: 16, color: '#007AFF', fontWeight: 'bold', marginTop: 5 },
});