import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Mchele 5kg', price: 12000, stock: 25, image: '🍚', active: true },
  { id: '2', name: 'Mafuta 1L', price: 8000, stock: 0, image: '🛢️', active: false },
  { id: '3', name: 'Sukari 2kg', price: 6000, stock: 15, image: '🍬', active: true },
];

export default function ManageProducts() {
  const navigation = useNavigation();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const toggleActive = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deleteProduct = (id) => {
    Alert.alert('Futa Bidhaa', 'Una uhakika?', [
      { text: 'Ghairi' },
      { text: 'Futa', style: 'destructive', onPress: () => setProducts(products.filter(p => p.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bidhaa Zangu</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.addText}>+ Ongeza</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productIcon}>{item.image}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>TSh {item.price.toLocaleString()}</Text>
              <Text style={[styles.productStock, item.stock === 0 && styles.outOfStock]}>
                Stock: {item.stock}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleActive(item.id)}>
                <Text style={[styles.toggle, item.active && styles.toggleActive]}>
                  {item.active ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddProduct', { product: item })}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 15, borderRadius: 12 },
  productIcon: { fontSize: 40, marginRight: 15 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  productPrice: { fontSize: 15, color: '#007AFF', fontWeight: '600' },
  productStock: { fontSize: 13, color: '#666', marginTop: 4 },
  outOfStock: { color: '#F44336', fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  toggle: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, backgroundColor: '#ddd', color: '#666' },
  toggleActive: { backgroundColor: '#4CAF50', color: '#fff' },
  edit: { fontSize: 20 },
  delete: { fontSize: 20 },
});