import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const PENDING_USERS = [
  { id: '1', name: 'John Mwangi', role: 'driver', phone: '+255712345678', date: '16 Jun 2026', docs: 'Leseni, Bima' },
  { id: '2', name: 'Neema Store', role: 'vendor', phone: '+255723456789', date: '15 Jun 2026', docs: 'Leseni Biashara' },
  { id: '3', name: 'Moshi Garage', role: 'garage', phone: '+255734567890', date: '14 Jun 2026', docs: 'Cheti Gereji' },
];

const ROLE_ICONS = { driver: '🏍', vendor: '🏪', garage: '🔧' };
const ROLE_NAMES = { driver: 'Dereva', vendor: 'Duka', garage: 'Gereji' };

export default function UserManagement() {
  const [users, setUsers] = useState(PENDING_USERS);
  const [filter, setFilter] = useState('all');

  const approveUser = (id) => {
    Alert.alert('Idhinisha', 'Una uhakika unataka kumidhinisha?', [
      { text: 'Ghairi' },
      { text: 'Idhinisha', onPress: () => setUsers(users.filter(u => u.id!== id)) },
    ]);
  };

  const rejectUser = (id) => {
    Alert.alert('Kataa', 'Andika sababu ya kukataa', [
      { text: 'Ghairi' },
      { text: 'Kataa', style: 'destructive', onPress: () => setUsers(users.filter(u => u.id!== id)) },
    ]);
  };

  const filtered = filter === 'all'? users : users.filter(u => u.role === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Idhinisha Watumiaji</Text>
      <Text style={styles.subtitle}>{users.length} Wanaosubiri</Text>

      <View style={styles.filters}>
        {['all', 'driver', 'vendor', 'garage'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all'? 'Wote' : ROLE_NAMES[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <Text style={styles.userIcon}>{ROLE_ICONS[item.role]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{ROLE_NAMES[item.role]} • {item.phone}</Text>
              </View>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <Text style={styles.docsLabel}>Nyaraka: {item.docs}</Text>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectUser(item.id)}>
                <Text style={styles.rejectText}>Kataa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={() => approveUser(item.id)}>
                <Text style={styles.approveText}>✓ Idhinisha</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: '#666', paddingHorizontal: 20, marginTop: 5, marginBottom: 20 },
  filters: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
  filterActive: { backgroundColor: '#007aff' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#666' },
  filterTextActive: { color: '#fff' },
  userCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 12 },
  userHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  userIcon: { fontSize: 32, marginRight: 12 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userRole: { fontSize: 14, color: '#666', marginTop: 4 },
  date: { fontSize: 12, color: '#999' },
  docsLabel: { fontSize: 14, color: '#333', marginBottom: 12, backgroundColor: '#f5f5f5', padding: 8, borderRadius: 6 },
  btnRow: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#f44336', borderRadius: 8, alignItems: 'center' },
  rejectText: { fontSize: 15, color: '#f44336', fontWeight: 'bold' },
  approveBtn: { flex: 1, padding: 12, backgroundColor: '#4caf50', borderRadius: 8, alignItems: 'center' },
  approveText: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
});