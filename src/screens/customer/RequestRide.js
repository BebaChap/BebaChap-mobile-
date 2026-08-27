import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext'; // <- ONGEZA HII

const VEHICLES_STATIC = [
  { 
    id: 'boda', 
    name: 'Bodaboda', 
    price: 'TSh 2,000', 
    time: '3-5 min',
    capacity: 'Mtu 1',
    image: require('../../../assets/icons/bodaboda.png'),
    color: '#FFF3E0',
    driver: 'Juma Boda',
    phone: '0712345678'
  },
  { 
    id: 'bajaji', 
    name: 'Bajaji', 
    price: 'TSh 4,000', 
    time: '4-6 min',
    capacity: 'Watu 3',
    image: require('../../../assets/icons/bajaji.png'),
    color: '#FFF9C4',
    driver: 'Issa Bajaji',
    phone: '0655123456'
  },
  { 
    id: 'taxi', 
    name: 'Teksi', 
    price: 'TSh 8,000', 
    time: '5-8 min',
    capacity: 'Watu 4',
    image: require('../../../assets/icons/taxi.png'),
    color: '#E3F2FD',
    driver: 'John Taxi',
    phone: '0767987654'
  },
  { 
    id: 'pickup', 
    name: 'Pickup', 
    price: 'TSh 15,000', 
    time: '8-12 min',
    capacity: 'Mizigo',
    image: require('../../../assets/icons/pickup.png'),
    color: '#E8F5E9',
    driver: 'Musa Pickup',
    phone: '0688123456'
  },
];

const getFare = async (vehicleType, distanceKm = 3, durationMin = 10) => {
  try {
    const { data, error } = await supabase
      .from('fare_settings')
      .select('*')
      .eq('vehicle_type', vehicleType)
      .eq('is_active', true)
      .single();
    
    if(error || !data) return null;
    const fare = data.base_fare + (distanceKm * data.per_km) + (durationMin * data.per_minute);
    return Math.max(fare, data.min_fare);
  } catch (e) {
    console.log("Fare error", e);
    return null;
  }
};

export default function RequestRide({ navigation }) {
  const { t } = useLanguage(); // <- ONGEZA HII NDANI YA FUNCTION
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selected, setSelected] = useState('bajaji');
  const [payment, setPayment] = useState('M-Pesa');
  const [fareMap, setFareMap] = useState({});
  const [loadingFares, setLoadingFares] = useState(true);

  const selectedVehicle = VEHICLES_STATIC.find(v => v.id === selected);

  const fetchFares = async () => {
    setLoadingFares(true);
    try {
      const { data, error } = await supabase.from('fare_settings').select('*').eq('is_active', true);
      if(!error && data){
        const map = {};
        data.forEach(f => {
          map[f.vehicle_type] = f.min_fare;
        });
        setFareMap(map);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingFares(false);
    }
  };

  useEffect(() => {
    fetchFares();
  }, []);

  useEffect(() => {
    if(from.trim() && to.trim()){
      const recalc = async () => {
        const newMap = {};
        for(const v of VEHICLES_STATIC){
          const fare = await getFare(v.id, 5, 15);
          if(fare) newMap[v.id] = fare;
        }
        if(Object.keys(newMap).length > 0){
          setFareMap(prev => ({...prev, ...newMap}));
        }
      };
      recalc();
    }
  }, [from, to]);

  const VEHICLES = VEHICLES_STATIC.map(v => ({
    ...v,
    displayPrice: fareMap[v.id] ? `TSh ${fareMap[v.id].toLocaleString()}` : v.price,
    rawPrice: fareMap[v.id] || 0
  }));

  const selectedVehicleLive = VEHICLES.find(v => v.id === selected);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{t('request_ride')}</Text>
          <Text style={styles.subtitle}>{t('choose_vehicle')} {loadingFares ? `(${t('loading_fares')})` : ''}</Text>
        </View>
        <View style={{width:40}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 140}}>
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={[styles.dot, {backgroundColor: '#22c55e'}]}><View style={styles.dotInner} /></View>
            <View style={{flex:1}}>
              <Text style={styles.label}>{t('where_from')}</Text>
              <TextInput placeholder={t('placeholder_from')} placeholderTextColor="#999" style={styles.input} value={from} onChangeText={setFrom} />
            </View>
            <Ionicons name="location-sharp" size={20} color="#22c55e" />
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.locationRow}>
            <View style={[styles.dot, {backgroundColor: '#ef4444'}]}><Ionicons name="location" size={12} color="#fff" /></View>
            <View style={{flex:1}}>
              <Text style={styles.label}>{t('where_are_you_going')}</Text>
              <TextInput placeholder={t('placeholder_to')} placeholderTextColor="#999" style={styles.input} value={to} onChangeText={setTo} />
            </View>
            <Ionicons name="map" size={20} color="#ef4444" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('choose_car')} 🛺</Text>
        <View style={styles.grid}>
          {VEHICLES.map((v) => {
            const isSelected = selected === v.id;
            return (
              <TouchableOpacity 
                key={v.id} 
                onPress={() => setSelected(v.id)}
                style={[styles.squareCard, isSelected && styles.squareCardActive]}
              >
                <View style={[styles.squareImgWrapper, {backgroundColor: v.color}]}>
                  <Image source={v.image} style={styles.squareImg} resizeMode="contain" />
                </View>
                <Text style={styles.squareName}>{v.name}</Text>
                {loadingFares ? <ActivityIndicator size="small" color={COLORS.primary} style={{marginTop:4}}/> : <Text style={styles.squarePrice}>{v.displayPrice}</Text>}
                <View style={{flexDirection:'row', gap:4, marginTop:6}}>
                  <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>{v.time}</Text></View>
                  <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>{v.capacity}</Text></View>
                </View>
                {isSelected && <View style={styles.selectedTick}><Ionicons name="checkmark" size={14} color="#fff" /></View>}
              </TouchableOpacity>
            )
          })}
        </View>

        {selectedVehicleLive && (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={26} color={COLORS.primary} />
            </View>
            <View style={{flex:1}}>
              <Text style={styles.driverLabel}>{t('selected_driver')}</Text>
              <Text style={styles.driverName}>{selectedVehicleLive.driver} • {selectedVehicleLive.name}</Text>
              <View style={{flexDirection:'row', alignItems:'center', gap:6, marginTop:2}}>
                <Ionicons name="call" size={14} color="#22c55e" />
                <Text style={styles.driverPhone}>{selectedVehicleLive.phone}</Text>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>{t('online')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${selectedVehicleLive.phone}`)}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t('pay_with')} 💳</Text>
        <View style={styles.paymentRow}>
          {['M-Pesa', 'Tigo Pesa', 'Airtel', 'Azam Pesa', 'Cash'].map(p => (
            <TouchableOpacity key={p} onPress={() => setPayment(p)} style={[styles.payChip, payment === p && styles.payChipActive]}>
              <Text style={[styles.payText, payment === p && styles.payTextActive]}>{p === 'Cash' ? t('word_cash') : p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('total')} • {selectedVehicleLive?.phone}</Text>
          <Text style={styles.totalPrice}>{selectedVehicleLive?.displayPrice}</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={() => navigation.navigate('LiveTracking', { vehicle: selectedVehicleLive, from, to, payment })}>
          <Text style={styles.orderBtnText}>{t('order_now_vehicle', { name: selectedVehicleLive?.name })}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 55, paddingBottom: 20, paddingHorizontal: 16, backgroundColor: '#fff' },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  locationCard: { margin: 16, backgroundColor: '#fff', borderRadius: 24, padding: 18, elevation: 5, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  label: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 2 },
  input: { fontSize: 16, fontWeight: '600', color: '#111', paddingVertical: 4 },
  dashedLine: { height: 1, borderWidth: 1, borderColor: '#eee', borderStyle: 'dashed', marginVertical: 14, marginLeft: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 10, marginBottom: 12, marginLeft: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, justifyContent: 'space-between' },
  squareCard: { width: '48%', backgroundColor: '#fff', borderRadius: 22, padding: 14, borderWidth: 1.5, borderColor: '#eee', alignItems: 'center', position: 'relative' },
  squareCardActive: { borderColor: COLORS.primary, backgroundColor: '#F0F7FF', borderWidth: 2, shadowColor: COLORS.primary, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
  squareImgWrapper: { width: '100%', height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  squareImg: { width: 90, height: 70 },
  squareName: { fontSize: 15, fontWeight: '800', color: '#111', marginTop: 10 },
  squarePrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  miniBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  miniBadgeText: { fontSize: 10, fontWeight: '600', color: '#666' },
  selectedTick: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  driverCard: { marginHorizontal: 16, marginTop: 18, backgroundColor: '#fff', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#eee', elevation: 3 },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF5FF', alignItems: 'center', justifyContent: 'center' },
  driverLabel: { fontSize: 11, color: '#888', fontWeight: '600' },
  driverName: { fontSize: 14, fontWeight: '800', color: '#111', marginTop: 1 },
  driverPhone: { fontSize: 13, fontWeight: '700', color: '#111' },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  onlineText: { fontSize: 11, color: '#22c55e', fontWeight: '700' },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  payChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#eee' },
  payChipActive: { backgroundColor: '#111', borderColor: '#111' },
  payText: { fontWeight: '700', color: '#555' },
  payTextActive: { color: '#fff' },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, paddingBottom: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  totalRow: { flex: 1 },
  totalLabel: { fontSize: 11, color: '#888', fontWeight: '600' },
  totalPrice: { fontSize: 20, fontWeight: '900', color: '#111' },
  orderBtn: { flex: 2, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18, borderRadius: 18 },
  orderBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});