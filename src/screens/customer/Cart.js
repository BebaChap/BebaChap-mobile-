import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const cartItems = [
  { id: '1', name: 'Mchele 5kg', price: 12000, qty: 1 },
  { id: '2', name: 'Mafuta 1L', price: 8000, qty: 2 },
];

export default function Cart({ navigation }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kikapu Changu</Text>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name} x{item.qty}</Text>
            <Text style={styles.itemPrice}>TSh {(item.price * item.qty).toLocaleString()}</Text>
          </View>
        )}
      />
      
      <View style={styles.footer}>
        <Text style={styles.total}>Jumla: TSh {total.toLocaleString()}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.buttonText}>Lipa Sasa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  item: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 20
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  total: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 8 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});