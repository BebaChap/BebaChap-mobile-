import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const TXNS = [
  { id: '1', type: 'in', desc: 'Top-up M-Pesa', amount: '50,000', date: '16 Jun' },
  { id: '2', type: 'out', desc: 'Safari Posta', amount: '3,500', date: '16 Jun' },
  { id: '3', type: 'out', desc: 'Mchele 5kg', amount: '12,000', date: '15 Jun' },
];

export default function Wallet({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>Salio Lako</Text>
        <Text style={styles.balanceAmount}>TSh 34,500</Text>
        <TouchableOpacity 
          style={styles.topupBtn}
          onPress={() => navigation?.navigate('TopUp')}
        >
          <Text style={styles.topupText}>+ Ongeza Pesa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Miamala</Text>
      <FlatList
        data={TXNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txn}>
            <Text style={styles.txnIcon}>{item.type === 'in' ? '↓' : '↑'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnDesc}>{item.desc}</Text>
              <Text style={styles.txnDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txnAmount, { color: item.type === 'in' ? 'green' : 'red' }]}>
              {item.type === 'in' ? '+' : '-'}TSh {item.amount}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Hakuna miamala bado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  balance: { 
    backgroundColor: '#007AFF', 
    margin: 20, 
    padding: 30, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  balanceLabel: { fontSize: 16, color: '#fff', opacity: 0.8 },
  balanceAmount: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginVertical: 10 },
  topupBtn: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginTop: 10 
  },
  topupText: { color: '#007AFF', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 10 },
  txn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    marginHorizontal: 20, 
    marginBottom: 10, 
    borderRadius: 10 
  },
  txnIcon: { fontSize: 24, marginRight: 15 },
  txnDesc: { fontSize: 16, fontWeight: '600' },
  txnDate: { fontSize: 14, color: '#666', marginTop: 4 },
  txnAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});