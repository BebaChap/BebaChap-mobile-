import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const NEW_ORDERS = [
  { id: '1', customer: 'Amina J.', items: 'Mchele 5kg x2', total: 24000, time: '5 min ago' },
  { id: '2', customer: 'Juma K.', items: 'Mafuta 2L', total: 8000, time: '12 min ago' },
];

export default function VendorDashboard() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [stats] = useState({
    todaySales: 156000,
    todayOrders: 12,
    rating: 4.8,
    pendingOrders: 3,
  });

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logout_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('my_shop')} 📊</Text>
          <Text style={styles.subtitle}>Juma Store</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 {t('logout')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>TSh {(stats.todaySales / 1000).toFixed(0)}K</Text>
          <Text style={styles.statLabel}>{t('sales_today')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.todayOrders}</Text>
          <Text style={styles.statLabel}>{t('orders_today')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>⭐ {stats.rating}</Text>
          <Text style={styles.statLabel}>{t('rating_lbl')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('new_orders_title', { count: stats.pendingOrders })}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAll}>{t('see_all')} →</Text>
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
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CommonStack', { screen: 'VendorProducts' })}>
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>{t('add_product')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CommonStack', { screen: 'ShopProfile' })}>
          <Text style={styles.actionIcon}>⚙</Text>
          <Text style={styles.actionText}>{t('edit_shop')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  logoutBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
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