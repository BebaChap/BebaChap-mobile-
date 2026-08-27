import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

const PENDING_DISPUTES = [
  { id: '1', customer: 'Juma M.', driver: 'John Mwangi', type: 'overcharge', status: 'open', date: '16 Jun 2026', desc: 'Dereva alitoza TSH 5000 zaidi' },
  { id: '2', customer: 'Neema S.', vendor: 'Neema Store', type: 'wrong_item', status: 'open', date: '15 Jun 2026', desc: 'Bidhaa tofauti na iliyoagizwa' },
  { id: '3', customer: 'Asha K.', driver: 'Ali J.', type: 'rude', status: 'pending', date: '14 Jun 2026', desc: 'Dereva alikuwa mjeuri' },
];

const TYPE_ICONS = { overcharge: '💰', wrong_item: '📦', rude: '😡', late: '⏰', other: '⚠️' };

export default function Disputes() {
  const { t } = useLanguage();
  const TYPE_NAMES = { overcharge: t('dispute_overcharge'), wrong_item: t('dispute_wrong_item'), rude: t('dispute_rude'), late: t('dispute_late'), other: t('dispute_other') };
  const [disputes, setDisputes] = useState(PENDING_DISPUTES);
  const [filter, setFilter] = useState('all');
  const [resolution, setResolution] = useState({});

  const resolveDispute = (id) => {
    if(!resolution[id]?.trim()){
      Alert.alert(t('error'), t('write_resolution'));
      return;
    }
    Alert.alert(t('confirm'), t('confirm_resolve_dispute'), [
      { text: t('cancel') },
      { text: t('confirm'), onPress: () => {
        setDisputes(disputes.filter(d => d.id!== id));
        Alert.alert(t('success'), t('complaint_handled'));
      }},
    ]);
  };

  const filtered = filter === 'all'? disputes : disputes.filter(d => d.status === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('open_disputes')}</Text>
      <Text style={styles.subtitle}>{disputes.length} {t('pending')}</Text>

      <View style={styles.filters}>
        {['all', 'open', 'pending'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all'? t('all') : f === 'open'? t('status_open') : t('pending')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.icon}>{TYPE_ICONS[item.type] || '⚠️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.customer} → {item.driver || item.vendor}</Text>
                <Text style={styles.type}>{TYPE_NAMES[item.type] || item.type} • {item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'open'? '#ffebee' : '#fff3e0' }]}>
                <Text style={[styles.statusText, { color: item.status === 'open'? '#c62828' : '#e65100' }]}>{item.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.desc}>{item.desc}</Text>

            <Text style={styles.label}>{t('write_resolution')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('write_resolution')}
              value={resolution[item.id] || ''}
              onChangeText={(v) => setResolution(prev => ({...prev, [item.id]: v }))}
              multiline
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.resolveBtn} onPress={() => resolveDispute(item.id)}>
                <Text style={styles.resolveText}>✓ {t('complaint_handled')}</Text>
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
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  icon: { fontSize: 28, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  type: { fontSize: 13, color: '#666', marginTop: 3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800' },
  desc: { fontSize: 14, color: '#333', backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
  btnRow: { flexDirection: 'row' },
  resolveBtn: { flex: 1, padding: 12, backgroundColor: '#4caf50', borderRadius: 8, alignItems: 'center' },
  resolveText: { color: '#fff', fontWeight: 'bold' },
});