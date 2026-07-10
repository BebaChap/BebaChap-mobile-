import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NEW_ORDERS = [
  { id: '1', customer: 'Amina J.', items: 'Mchele 5kg x2', total: 24000, time: '5 min ago' },
  { id: '2', customer: 'Juma K.', items: 'Mafuta 2L', total: 8000, time: '12 min ago' },
];

export default function VendorDashboard() {
  const navigation = useNavigation();
  const [stats] = useState({
    todaySales: 156000,
    todayOrders: 12,
    rating: 4.8,
    pendingOrders: 3,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Duka Langu 📊</Text>
        <Text style={styles.subtitle}>Juma Store</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>TSh {(stats.todaySales / 1000).toFixed(0)}K</Text>
          <Text style={styles.statLabel}>Mauzo Leo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.todayOrders}</Text>
          <Text style={styles.statLabel}>Oda Leo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>⭐ {stats.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Oda Mpya ({stats.pendingOrders})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAll}>Ona Zote →</Text>
          </TouchableOpacity>
        </View>

        {NEW_ORDERS.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => navigation.navigate('Orders')}>
            <View style={styles.orderHeader}>
              <Text style={styles.customer}>👤 {order.customer}</Text>
              <Text style={styles.orderPrice}>TSh {order.total.toLocaleString()}</Text>
            </View>
            <Text style={styles.orderItems}>{order.items}</Text>
            <Text style={styles.orderTime}>{order.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Ongeza Bidhaa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Shop')}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Hariri Duka</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 5 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50'
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customer: { fontSize: 16, fontWeight: 'bold' },
  orderPrice: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  orderItems: { fontSize: 15, color: '#333', marginBottom: 5 },
  orderTime: { fontSize: 13, color: '#999' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginTop: 10, marginBottom: 30 },
  actionBtn: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600' },
});