import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function AdminDashboard({ navigation }) {
  const [stats] = useState({
    totalUsers: 12450,
    customers: 10200,
    drivers: 1850,
    vendors: 320,
    garages: 80,
    totalOrders: 45230,
    totalRides: 38900,
    todayOrders: 234,
    todayRides: 189,
    revenue: 12560000,
    pendingApprovals: 12,
    openDisputes: 5,
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Muhtasari wa Mfumo</Text>

      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statValue}>{stats.totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Watumiaji Wote</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>TSH {(stats.revenue / 1000000).toFixed(1)}M</Text>
          <Text style={styles.statLabel}>Mapato Jumla</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🛒</Text>
          <Text style={styles.statValue}>{stats.totalOrders.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Oda Zote</Text>
          <Text style={styles.statSub}>Leo: {stats.todayOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🚗</Text>
          <Text style={styles.statValue}>{stats.totalRides.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Safari Zote</Text>
          <Text style={styles.statSub}>Leo: {stats.todayRides}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mgawanyo wa Watumiaji</Text>
      <View style={styles.userBreakdown}>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownIcon}>👤</Text>
          <Text style={styles.breakdownLabel}>Wateja</Text>
          <Text style={styles.breakdownValue}>{stats.customers.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownIcon}>🏍</Text>
          <Text style={styles.breakdownLabel}>Madereva</Text>
          <Text style={styles.breakdownValue}>{stats.drivers.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownIcon}>🏪</Text>
          <Text style={styles.breakdownLabel}>Maduka</Text>
          <Text style={styles.breakdownValue}>{stats.vendors.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownIcon}>🔧</Text>
          <Text style={styles.breakdownLabel}>Gereji</Text>
          <Text style={styles.breakdownValue}>{stats.garages.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.alerts}>
        <TouchableOpacity style={[styles.alertCard, { backgroundColor: '#fff3e0' }]} onPress={() => navigation.navigate('Users')}>
          <Text style={styles.alertIcon}>⏳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Wanaosubiri Approval</Text>
            <Text style={styles.alertDesc}>{stats.pendingApprovals} madereva/maduka yanahitaji kuidhinishwa</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.alertCard, { backgroundColor: '#ffebee' }]} onPress={() => navigation.navigate('Disputes')}>
          <Text style={styles.alertIcon}>⚠</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Malalamiko Wazi</Text>
            <Text style={styles.alertDesc}>{stats.openDisputes} malalamiko yanahitaji kushughulikiwa</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: '#666', paddingHorizontal: 20, marginTop: 5, marginBottom: 20 },
  grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 15 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#007aff' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  statSub: { fontSize: 12, color: '#999', marginTop: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  userBreakdown: { paddingHorizontal: 20, marginBottom: 25 },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  breakdownIcon: { fontSize: 28, marginRight: 15 },
  breakdownLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  breakdownValue: { fontSize: 18, fontWeight: 'bold', color: '#007aff' },
  alerts: { paddingHorizontal: 20, marginBottom: 30 },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  alertIcon: { fontSize: 32, marginRight: 15 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  alertDesc: { fontSize: 14, color: '#666' },
  arrow: { fontSize: 28, color: '#999' },
});