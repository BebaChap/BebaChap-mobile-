import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function Home({ navigation }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('usafiri');
  const [destination, setDestination] = useState('');
  const [showCard, setShowCard] = useState(true);

  const tabsOrder = ['usafiri', 'duka', 'gereji', 'restaurant'];
  const currentIndex = tabsOrder.indexOf(activeTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tabsOrder.length - 1;

  const goNext = () => {
    if (!isLast) setActiveTab(tabsOrder[currentIndex + 1]);
  };
  const goBack = () => {
    if (!isFirst) setActiveTab(tabsOrder[currentIndex - 1]);
  };

  const handleLogout = () => {
    Alert.alert("Toka", "Una uhakika unataka kutoka?", [
      { text: "Ghairi", style: "cancel" },
      {
        text: "Toka", style: "destructive",
        onPress: async () => {
          await logout();
          // FIX: USIWEKE navigation.reset HAPA KABISA
        }
      }
    ]);
  };

  const safeNavigate = (screenName, params = {}) => {
    try {
      navigation.navigate(screenName, params);
    } catch (e) {
      Alert.alert("Taarifa", `Screen ya ${screenName} bado haijasajiliwa kwenye Navigator. Isajili kwanza kwenye AppNavigator.js`);
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={() => setShowCard(false)}
        initialRegion={{
          latitude: -6.7924,
          longitude: 39.2083,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -6.7924, longitude: 39.2083 }} title="Uko Hapa" />
        {activeTab === 'duka' && <Marker coordinate={{ latitude: -6.7824, longitude: 39.2183 }} pinColor="orange" title="Duka la Spare" description="1.2km • OPEN" />}
        {activeTab === 'gereji' && <Marker coordinate={{ latitude: -6.8024, longitude: 39.1983 }} pinColor="green" title="Gereji Fundi" description="0.8km • OPEN" />}
        {activeTab === 'restaurant' && <Marker coordinate={{ latitude: -6.7724, longitude: 39.2283 }} pinColor="red" title="Restaurant" description="0.5km • OPEN" />}
      </MapView>

      <View style={styles.topContainer}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Habari, {user?.name?.split(' ')[0] || 'Juma'} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color="#080606" />
              <Text style={styles.locationText}>Tabata, Dar es Salaam</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder={
              activeTab === 'usafiri'? "Unaenda wapi?" :
              activeTab === 'duka'? "Tafuta spare..." :
              activeTab === 'gereji'? "Tafuta fundi..." : "Tafuta chakula..."
            }
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={destination}
            onChangeText={setDestination}
          />
          <Ionicons name="options" size={20} color={COLORS.primary} />
        </View>

        <View style={styles.tabs}>
          <View style={styles.tabsRow}>
            <TouchableOpacity style={[styles.tab, styles.tabHalf, activeTab === 'usafiri' && styles.activeTab]} onPress={() => { setActiveTab('usafiri'); setShowCard(true); }}>
              <Text style={[styles.tabText, activeTab === 'usafiri' && styles.activeTabText]}>🛺🚕 Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.tabHalf, activeTab === 'duka' && styles.activeTab]} onPress={() => { setActiveTab('duka'); setShowCard(true); }}>
              <Text style={[styles.tabText, activeTab === 'duka' && styles.activeTabText]}>🏤 Duka</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabsRow}>
            <TouchableOpacity style={[styles.tab, styles.tabHalf, activeTab === 'gereji' && styles.activeTab]} onPress={() => { setActiveTab('gereji'); setShowCard(true); }}>
              <Text style={[styles.tabText, activeTab === 'gereji' && styles.activeTabText]}>🛠 Gereji</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.tabHalf, activeTab === 'restaurant' && styles.activeTab]} onPress={() => { setActiveTab('restaurant'); setShowCard(true); }}>
              <Text style={[styles.tabText, activeTab === 'restaurant' && styles.activeTabText]}>🍔 Mgahawa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {!showCard && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowCard(true)}>
          <Ionicons name="chevron-up" size={18} color="#fff" />
          <Text style={styles.fabText}>Ona Huduma</Text>
        </TouchableOpacity>
      )}

      {showCard && (
        <View style={styles.bottomCard}>
          <TouchableOpacity onPress={() => setShowCard(false)} style={styles.handleArea}>
            <View style={styles.line} />
            <Text style={styles.hideTxt}>Ficha ▼</Text>
          </TouchableOpacity>

          {activeTab === 'usafiri' && (
            <>
              <Text style={styles.title}>Pata Usafiri Haraka!</Text>
              <Text style={styles.sub}>Dereva wa karibu ndani ya dakika 3</Text>
              <TouchableOpacity style={styles.mainBtn} onPress={() => safeNavigate('RequestRide', { destination })}>
                <Text style={styles.mainBtnText}>Request Ride</Text>
              </TouchableOpacity>
            </>
          )}
          {activeTab === 'duka' && (
            <>
              <Text style={styles.title}>Karibu Dukani</Text>
              <Text style={styles.sub}>Spare 5 ziko umbali wa 1.2km - OPEN</Text>
              <TouchableOpacity style={styles.mainBtn} onPress={() => safeNavigate('ShopList')}>
                <Text style={styles.mainBtnText}>Tembelea Maduka</Text>
              </TouchableOpacity>
            </>
          )}
          {activeTab === 'gereji' && (
            <>
              <Text style={styles.title}>Fundi wa Karibu</Text>
              <Text style={styles.sub}>Pata huduma ya uhakika - 0.8km</Text>
              <TouchableOpacity style={styles.mainBtn} onPress={() => safeNavigate('GarageList')}>
                <Text style={styles.mainBtnText}>Pata Fundi</Text>
              </TouchableOpacity>
            </>
          )}
          {activeTab === 'restaurant' && (
            <>
              <Text style={styles.title}>Migahawa ya Karibu 🍔</Text>
              <Text style={styles.sub}>Chakula kitamu - 0.5km - Inawaka</Text>
              <TouchableOpacity style={styles.mainBtn} onPress={() => safeNavigate('RestaurantList', { search: destination })}>
                <Text style={styles.mainBtnText}>Angalia Menu</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.navCard}>
            {!isFirst? (
              <TouchableOpacity style={styles.arrowBtn} onPress={goBack}>
                <Ionicons name="chevron-back" size={22} color="#333" />
              </TouchableOpacity>
            ) : <View style={styles.arrowPlaceholder} />}

            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>{currentIndex + 1} / {tabsOrder.length}</Text>
            </View>

            {!isLast? (
              <TouchableOpacity style={styles.arrowBtnPrimary} onPress={goNext}>
                <Ionicons name="chevron-forward" size={22} color="#fff" />
              </TouchableOpacity>
            ) : <View style={styles.arrowPlaceholder} />}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {...StyleSheet.absoluteFillObject },
  topContainer: { position: 'absolute', top: 0, left: 0, right: 0, padding: 15, paddingTop: 50 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  greeting: { fontSize: 18, fontWeight: '800', color: '#000000', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: {width:0,height:1}, textShadowRadius: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { color: '#2d0068', fontSize: 13, marginLeft: 4, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: {width:0,height:1}, textShadowRadius: 4 },
  logoutCard: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.8)',
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18, paddingHorizontal: 16, height: 54, elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.9)',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#000', fontWeight: '500' },
  tabs: { marginTop: 16, alignItems: 'center' },
  tabsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 12 },
  tab: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.8, borderColor: 'rgba(255,255,255,0.9)',
    elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12,
  },
  tabHalf: { width: '46%', minWidth: 150 },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 10,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowRadius: 14,
  },
  tabText: { fontWeight: '700', color: '#1c03a5', fontSize: 15, textAlign: 'center', letterSpacing: 0.2 },
  activeTabText: { color: '#fff' },
  fab: {
    position: 'absolute', bottom: 25, alignSelf: 'center',
    backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 22, paddingVertical: 13, borderRadius: 28, elevation: 10,
  },
  fabText: { color: '#fff', fontWeight: 'bold' },
  bottomCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 10, paddingBottom: 32, elevation: 20 },
  handleArea: { alignItems: 'center', paddingVertical: 8 },
  line: { width: 44, height: 5, backgroundColor: '#e0e0e0', borderRadius: 10, marginBottom: 6 },
  hideTxt: { fontSize: 11, color: '#aaa', fontWeight: '700', letterSpacing: 0.5 },
  title: { fontSize: 19, fontWeight: '800', color: '#111' },
  sub: { color: '#777', marginTop: 4, marginBottom: 16, fontSize: 14 },
  mainBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, alignItems: 'center', elevation: 4 },
  mainBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  navCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  arrowBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: '#e8e8e8',
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  arrowBtnPrimary: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 6,
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8,
  },
  arrowPlaceholder: { width: 48, height: 48 },
  centerInfo: { backgroundColor: '#f2f2f7', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  centerText: { fontSize: 12, fontWeight: '700', color: '#666' },
});