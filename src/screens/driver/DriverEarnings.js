import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';

const EARNINGS_DATA = {
  today: { amount: 45000, trips: 8 },
  week: { amount: 280000, trips: 52 },
  month: { amount: 1250000, trips: 215 },
};

const TRANSACTIONS = [
  { id: '1', type: 'trip', desc: 'Safari Sinza-Posta', amount: 3500, date: 'Leo 10:30' },
  { id: '2', type: 'trip', desc: 'Safari Mikocheni-Airport', amount: 15000, date: 'Leo 08:15' },
  { id: '3', type: 'withdraw', desc: 'Withdraw M-Pesa', amount: -50000, date: 'Jana 18:00' },
];

export default function Earnings({ navigation }) {
  const [period, setPeriod] = useState('today');
  const data = EARNINGS_DATA[period];

  const withdraw = () => {
    Alert.alert(
      'Withdraw Pesa',
      'Weka kiasi unachotaka kutoa',
      [
        { text: 'Ghairi' },
        { text: 'Toa TSh 20,000', onPress: () => Alert.alert('Imefanikiwa', 'Pesa zimetumwa M-Pesa') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapato Yangu</Text>

      <View style={styles.periodTabs}>
        {['today', 'week', 'month'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.tab, period === p && styles.activeTab]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.tabText, period === p && styles.activeTabText]}>
              {p === 'today'? 'Leo' : p === 'week'? 'Wiki' : 'Mwezi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Mapato</Text>
        <Text style={styles.earningsAmount}>TSh {data.amount.toLocaleString()}</Text>
        <Text style={styles.earningsTrips}>{data.trips} Safari</Text>
        <TouchableOpacity style={styles.withdrawBtn} onPress={withdraw}>
          <Text style={styles.withdrawText}>💰 Toa Pesa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Miamala ya Hivi Karibuni</Text>
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txn}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnDesc}>{item.desc}</Text>
              <Text style={styles.txnDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txnAmount, { color: item.amount > 0? '#4CAF50' : '#F44336' }]}>
              {item.amount > 0? '+' : ''}TSh {Math.abs(item.amount).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  periodTabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#fff' },
  earningsCard: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30
  },
  earningsLabel: { fontSize: 16, color: '#fff', opacity: 0.9 },
  earningsAmount: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginVertical: 10 },
  earningsTrips: { fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 20 },
  withdrawBtn: { backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  withdrawText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 15 },
  txn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10
  },
  txnDesc: { fontSize: 16, fontWeight: '600' },
  txnDate: { fontSize: 14, color: '#666', marginTop: 4 },
  txnAmount: { fontSize: 18, fontWeight: 'bold' },
});