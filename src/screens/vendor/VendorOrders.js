import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

const INITIAL_ORDERS = [
  // Order za Duka
  { id: '1', customer: 'Amina J.', items: 'Mchele 5kg x2', total: 24000, status: 'new', time: '5 min ago', type: 'shop', payment: 'Tigo Pesa' },
  { id: '2', customer: 'Peter M.', items: 'Mafuta 2L', total: 8000, status: 'processing', time: '1 hr ago', type: 'shop', payment: 'M-Pesa' },
  // Order za Restaurant
  { id: '3', customer: 'Neema S.', items: 'Chips Kavu x2, Kuku 1/2', total: 25000, status: 'new', time: '2 min ago', type: 'food', payment: 'Airtel Money', prepTime: '20 min', table: 'Takeaway' },
  { id: '4', customer: 'John D.', items: 'Pilau Kuku x1, Soda x2', total: 18000, status: 'preparing', time: '10 min ago', type: 'food', payment: 'HaloPesa', prepTime: '25 min', table: 'Dine-In' },
];

const STATUS_COLORS = {
  new: '#FF9800',
  processing: '#2196F3',
  preparing: '#FF6B00',
  ready: '#4CAF50',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
};

const STATUS_LABELS = {
  new: 'status_new',
  processing: 'status_processing',
  preparing: 'status_preparing',
  ready: 'status_ready',
  shipped: 'status_shipped',
  delivered: 'status_delivered',
};

export default function VendorOrders({ route }) {
  const { t } = useLanguage();
  const vendorType = route?.params?.vendorType || 'shop'; // 'shop' au 'restaurant'
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Logic yako ya awali - Sijagusa
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    Alert.alert(t('updated_alert'), t('order_set_to', { status: t(STATUS_LABELS[newStatus]) || newStatus.toUpperCase() }));
  };

  const filteredOrders = orders.filter(o => o.type === (vendorType === 'restaurant' ? 'food' : 'shop'));
  const dataToShow = filteredOrders.length > 0 ? filteredOrders : orders;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{vendorType === 'restaurant' ? t('food_orders') : t('all_orders')}</Text>
      <Text style={styles.subtitle}>{dataToShow.length} {t('orders_count')}{vendorType === 'restaurant' ? ` ${t('kitchen_suffix')}` : ''}</Text>

      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.customer}>👤 {item.customer}</Text>
                <View style={{flexDirection: 'row', gap: 6, marginTop: 4, alignItems: 'center'}}>
                  <Text style={styles.time}>{item.time}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.payment}>💳 {item.payment}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                <Text style={styles.statusText}>{t(STATUS_LABELS[item.status]) || item.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.items}>{item.items}</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.total}>TSh {item.total.toLocaleString()}</Text>
              {item.type === 'food' && (
                <View style={styles.foodBadges}>
                  {item.prepTime && <Text style={styles.prepBadge}>⏱ {item.prepTime}</Text>}
                  {item.table && <Text style={styles.tableBadge}>{item.table}</Text>}
                </View>
              )}
            </View>

            <View style={styles.btnRow}>
              {/* FLOW YA DUKA */}
              {item.type === 'shop' && item.status === 'new' && (
                <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus(item.id, 'processing')}>
                  <Text style={styles.btnText}>{t('accept_order')}</Text>
                </TouchableOpacity>
              )}
              {item.type === 'shop' && item.status === 'processing' && (
                <TouchableOpacity style={styles.shipBtn} onPress={() => updateStatus(item.id, 'shipped')}>
                  <Text style={styles.btnText}>{t('shipped_btn')}</Text>
                </TouchableOpacity>
              )}
              {item.type === 'shop' && item.status === 'shipped' && (
                <TouchableOpacity style={styles.deliverBtn} onPress={() => updateStatus(item.id, 'delivered')}>
                  <Text style={styles.btnText}>{t('delivered_btn')}</Text>
                </TouchableOpacity>
              )}

              {/* FLOW YA RESTAURANT */}
              {item.type === 'food' && item.status === 'new' && (
                <TouchableOpacity style={styles.restaurantAccept} onPress={() => updateStatus(item.id, 'preparing')}>
                  <Text style={styles.btnText}>{t('start_preparing')}</Text>
                </TouchableOpacity>
              )}
              {item.type === 'food' && item.status === 'preparing' && (
                <TouchableOpacity style={styles.readyBtn} onPress={() => updateStatus(item.id, 'ready')}>
                  <Text style={styles.btnText}>{t('food_ready')}</Text>
                </TouchableOpacity>
              )}
              {item.type === 'food' && item.status === 'ready' && (
                <TouchableOpacity style={styles.shipBtn} onPress={() => updateStatus(item.id, 'shipped')}>
                  <Text style={styles.btnText}>{t('give_driver')}</Text>
                </TouchableOpacity>
              )}
              {item.type === 'food' && item.status === 'shipped' && (
                <TouchableOpacity style={styles.deliverBtn} onPress={() => updateStatus(item.id, 'delivered')}>
                  <Text style={styles.btnText}>{t('delivered_btn')}</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20 },
  subtitle: { fontSize: 14, color: '#888', paddingHorizontal: 20, marginBottom: 20, marginTop: 4 },
  orderCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  customer: { fontSize: 17, fontWeight: 'bold', color: '#111' },
  time: { fontSize: 13, color: '#999' },
  dot: { fontSize: 13, color: '#999' },
  payment: { fontSize: 12, color: '#007AFF', fontWeight: '600', backgroundColor: '#E8F0FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  items: { fontSize: 15, color: '#333', marginBottom: 8, lineHeight: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  foodBadges: { flexDirection: 'row', gap: 8 },
  prepBadge: { fontSize: 12, color: '#FF6B00', backgroundColor: '#FFF0E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: '600' },
  tableBadge: { fontSize: 12, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  acceptBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  shipBtn: { flex: 1, backgroundColor: '#9C27B0', padding: 12, borderRadius: 8, alignItems: 'center' },
  deliverBtn: { flex: 1, backgroundColor: '#111', padding: 12, borderRadius: 8, alignItems: 'center' },
  restaurantAccept: { flex: 1, backgroundColor: '#FF6B00', padding: 12, borderRadius: 8, alignItems: 'center' },
  readyBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});