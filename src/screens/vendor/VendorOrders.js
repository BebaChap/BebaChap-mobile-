import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const INITIAL_ORDERS = [
  { id: '1', customer: 'Amina J.', items: 'Mchele 5kg x2', total: 24000, status: 'new', time: '5 min ago' },
  { id: '2', customer: 'Peter M.', items: 'Mafuta 2L', total: 8000, status: 'processing', time: '1 hr ago' },
  { id: '3', customer: 'Neema S.', items: 'Sukari 2kg x3', total: 18000, status: 'shipped', time: '2 hrs ago' },
];

const STATUS_COLORS = {
  new: '#FF9800',
  processing: '#2196F3',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
};

export default function VendorOrders({ navigation }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    Alert.alert('Imesasishwa', `Oda imewekwa: ${newStatus}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oda Zote</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.customer}>👤 {item.customer}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.items}>{item.items}</Text>
            <Text style={styles.total}>TSh {item.total.toLocaleString()}</Text>

            <View style={styles.btnRow}>
              {item.status === 'new' && (
                <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus(item.id, 'processing')}>
                  <Text style={styles.btnText}>Kubali</Text>
                </TouchableOpacity>
              )}
              {item.status === 'processing' && (
                <TouchableOpacity style={styles.shipBtn} onPress={() => updateStatus(item.id, 'shipped')}>
                  <Text style={styles.btnText}>Imetumwa</Text>
                </TouchableOpacity>
              )}
              {item.status === 'shipped' && (
                <TouchableOpacity style={styles.deliverBtn} onPress={() => updateStatus(item.id, 'delivered')}>
                  <Text style={styles.btnText}>Imefikishwa</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  orderCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  customer: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 13, color: '#999', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  items: { fontSize: 15, color: '#333', marginBottom: 8 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 12 },
  btnRow: { flexDirection: 'row', gap: 10 },
  acceptBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  shipBtn: { flex: 1, backgroundColor: '#9C27B0', padding: 12, borderRadius: 8, alignItems: 'center' },
  deliverBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});