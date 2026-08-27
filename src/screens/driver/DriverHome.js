import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from '../../components/LogoutButton';
import { useLanguage } from '../../contexts/LanguageContext';

const FAKE_REQUESTS = [
  { id: '1', customer: 'Amina Juma', pickup: 'Sinza Mori', dropoff: 'Posta Mpya', price: 3500, distance: '4.2km', time: '8 min' },
  { id: '2', customer: 'Peter Mwamba', pickup: 'Mikocheni B', dropoff: 'Airport', price: 15000, distance: '18km', time: '35 min' },
];

export default function DriverDashboard() {
  const navigation = useNavigation();
  const { t, language, changeLanguage } = useLanguage();
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [todayEarnings, setTodayEarnings] = useState(45000);
  const [tripsToday, setTripsToday] = useState(8);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => <LogoutButton label={t('logout')} style={{ marginRight: 15, backgroundColor: 'transparent' }} textStyle={{ color: '#007aff' }} />
    });
  }, [navigation, language]);

  // simulate requests coming in when online
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setRequests(FAKE_REQUESTS);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setRequests([]);
    }
  }, [isOnline]);

  const acceptRequest = (request) => {
    setRequests(requests.filter(r => r.id!== request.id));
    navigation.navigate('RequestScreen', { request });
  };

  const rejectRequest = (id) => {
    setRequests(requests.filter(r => r.id!== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('hello')} {t('role_driver')} 👋</Text>
          <Text style={styles.subtitle}>{t('today')}: TSh {todayEarnings.toLocaleString()}</Text>
          <Text style={styles.trips}>{tripsToday} {t('word_trips')}</Text>

          {/* BUTTON MPYA YA TRIP HISTORY */}
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => navigation.navigate('CustomerApp', {
              screen: 'Trips',
            })}
          >
            <Text style={styles.historyBtnText}>📜 {t('trip_history')}</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.onlineWrap}>
          <Text style={[styles.onlineText, { color: isOnline? '#4CAF50' : '#999' }]}>
            {isOnline? t('online') : t('offline')}
          </Text>
          <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ true: '#4CAF50' }} />
        </View>
      </View>

      {!isOnline? (
        <View style={styles.offline}>
          <Text style={styles.offlineIcon}>📴</Text>
          <Text style={styles.offlineText}>{t('you_are_offline')}</Text>
          <Text style={styles.offlineDesc}>{t('offline_desc')}</Text>
        </View>
      ) : requests.length === 0? (
        <View style={styles.offline}>
          <Text style={styles.offlineIcon}>⏳</Text>
          <Text style={styles.offlineText}>{t('searching_customers')}</Text>
          <Text style={styles.offlineDesc}>{t('requests_will_appear')}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>{t('new_request', { count: requests.length })}</Text>
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.customer}>👤 {item.customer}</Text>
                    <Text style={styles.distance}>{item.distance} • {item.time}</Text>
                  </View>
                  <Text style={styles.price}>TSh {item.price.toLocaleString()}</Text>
                </View>

                <View style={styles.route}>
                  <Text style={styles.routeText}>📍 {item.pickup}</Text>
                  <Text style={styles.routeArrow}>↓</Text>
                  <Text style={styles.routeText}>🎯 {item.dropoff}</Text>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectRequest(item.id)}>
                    <Text style={styles.rejectText}>{t('reject')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptRequest(item)}>
                    <Text style={styles.acceptText}>{t('accept')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#007AFF', marginTop: 5, fontWeight: '600' },
  trips: { fontSize: 14, color: '#666', marginTop: 3 },
  onlineWrap: { alignItems: 'center' },
  onlineText: { fontSize: 14, marginBottom: 5, fontWeight: 'bold' },
  offline: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  offlineIcon: { fontSize: 80, marginBottom: 20 },
  offlineText: { fontSize: 22, fontWeight: 'bold', color: '#999', marginBottom: 10 },
  offlineDesc: { fontSize: 16, color: '#666', textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 15 },
  requestCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, padding: 20, borderRadius: 12, elevation: 2 },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  customer: { fontSize: 18, fontWeight: 'bold' },
  distance: { fontSize: 14, color: '#666', marginTop: 4 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  route: { marginBottom: 15 },
  routeText: { fontSize: 15, marginVertical: 3, color: '#333' },
  routeArrow: { fontSize: 20, textAlign: 'center', color: '#999', marginVertical: 2 },
  btnRow: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, padding: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  rejectText: { fontSize: 16, color: '#666', fontWeight: '600' },
  acceptBtn: { flex: 1, padding: 14, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center' },
  acceptText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  // STYLE MPYA ZA BUTTON
  historyBtn: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  historyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600'
  },
});