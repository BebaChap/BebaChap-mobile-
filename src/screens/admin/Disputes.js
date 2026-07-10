import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';

const DISPUTES_DATA = [
  { id: '1', user: 'Amina J.', type: 'ride', subject: 'Dereva alikataa safari', status: 'open', date: '16 Jun 2026', details: 'Dereva alikubali oda lakini hakufika. Alisema gari limeharibika.' },
  { id: '2', user: 'Peter M.', type: 'order', subject: 'Bidhaa haijafika', status: 'in_progress', date: '15 Jun 2026', details: 'Niliagiza mchele lakini haujaletwa kwa siku 3.' },
  { id: '3', user: 'Neema S.', type: 'payment', subject: 'Malipo yamekatwa mara 2', status: 'open', date: '14 Jun 2026', details: 'Nimelipa TSH 15,000 lakini nimekatwa mara mbili.' },
];

const STATUS_COLORS = { open: '#ff9800', in_progress: '#2196f3', resolved: '#4caf50' };
const TYPE_ICONS = { ride: '🚗', order: '🛒', payment: '💰' };

export default function Disputes() {
  const [disputes, setDisputes] = useState(DISPUTES_DATA);
  const [selected, setSelected] = useState(null);
  const [resolution, setResolution] = useState('');

  const resolveDispute = () => {
    if (!resolution.trim()) {
      Alert.alert('Kosa', 'Andika jinsi ulivyoshughulikia');
      return;
    }
    setDisputes(disputes.map(d => d.id === selected.id? {...d, status: 'resolved' } : d));
    Alert.alert('Imefanikiwa', 'Lalamiko limeshughulikiwa');
    setSelected(null);
    setResolution('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Malalamiko</Text>
      <Text style={styles.subtitle}>{disputes.filter(d => d.status!== 'resolved').length} yanahitaji kushughulikiwa</Text>

      <FlatList
        data={disputes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.disputeCard} onPress={() => setSelected(item)}>
            <View style={styles.disputeHeader}>
              <Text style={styles.disputeIcon}>{TYPE_ICONS[item.type]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.disputeSubject}>{item.subject}</Text>
                <Text style={styles.disputeUser}>{item.user} • {item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Shughulikia Lalamiko</Text>

            <View style={styles.modalInfo}>
              <Text style={styles.modalLabel}>Mteja:</Text>
              <Text style={styles.modalValue}>{selected?.user}</Text>
            </View>
            <View style={styles.modalInfo}>
              <Text style={styles.modalLabel}>Suala:</Text>
              <Text style={styles.modalValue}>{selected?.subject}</Text>
            </View>
            <View style={styles.modalInfo}>
              <Text style={styles.modalLabel}>Maelezo:</Text>
              <Text style={styles.modalValue}>{selected?.details}</Text>
            </View>

            <Text style={styles.label}>Suluhisho:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Andika jinsi ulivyoshughulikia..."
              value={resolution}
              onChangeText={setResolution}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelected(null)}>
                <Text style={styles.cancelText}>Ghairi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resolveBtn} onPress={resolveDispute}>
                <Text style={styles.resolveText}>✓ Shughulikia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: '#666', paddingHorizontal: 20, marginTop: 5, marginBottom: 20 },
  disputeCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12 },
  disputeHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  disputeIcon: { fontSize: 28, marginRight: 12 },
  disputeSubject: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  disputeUser: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginLeft: 10 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modalInfo: { marginBottom: 15 },
  modalLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  modalValue: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, height: 100, textAlignVertical: 'top' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  cancelText: { fontSize: 16, color: '#666', fontWeight: '600' },
  resolveBtn: { flex: 1, padding: 15, backgroundColor: '#4caf50', borderRadius: 8, alignItems: 'center' },
  resolveText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});