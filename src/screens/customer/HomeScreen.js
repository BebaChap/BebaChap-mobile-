import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // ← ONGEZA HII
import { Ionicons } from '@expo/vector-icons'; // ← ONGEZA HII - kama hutumii expo badilisha

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('usafiri');
  const { logout } = useAuth(); // ← ONGEZA HII

  // ← ONGEZA HII BLOCK YOTE
  const handleLogout = () => {
    Alert.alert('Logout', 'Una uhakika unataka kutoka?', [
      { text: 'Sitisha', style: 'cancel' },
      { 
        text: 'Toka', 
        style: 'destructive', 
        onPress: () => logout() 
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Mwanzo',
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="log-out-outline" size={26} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  const tabs = [
    { key: 'usafiri', label: 'Usafiri', icon: '🏍' },
    { key: 'duka', label: 'Duka', icon: '🛒' },
    { key: 'gereji', label: 'Gereji', icon: '🔧' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Habari, Juma 👋</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            placeholder="Tafuta usafiri, bidhaa, fundi..." 
            style={styles.searchInput} 
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'usafiri' && (
          <View>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('RequestRide')}
            >
              <Text style={styles.cardIcon}>📍</Text>
              <View>
                <Text style={styles.cardTitle}>Agiza Usafiri</Text>
                <Text style={styles.cardDesc}>Boda, bajaji, teksi</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('TripHistory')}
            >
              <Text style={styles.cardIcon}>📜</Text>
              <View>
                <Text style={styles.cardTitle}>Safari Zangu</Text>
                <Text style={styles.cardDesc}>Historia na risiti</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'duka' && (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.cardIcon}>🛍</Text>
            <View>
              <Text style={styles.cardTitle}>Nenda Dukani</Text>
              <Text style={styles.cardDesc}>Nunua bidhaa sasa</Text>
            </View>
          </TouchableOpacity>
        )}

        {activeTab === 'gereji' && (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Garage')}
          >
            <Text style={styles.cardIcon}>🔧</Text>
            <View>
              <Text style={styles.cardTitle}>Pata Fundi</Text>
              <Text style={styles.cardDesc}>Oil, tire, engine</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 20 }, // ← Nimebadilisha paddingTop kutoka 60 kwenda 20
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 15 
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 15 },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingBottom: 15, 
    borderBottomWidth: 3, 
    borderBottomColor: 'transparent' 
  },
  activeTab: { borderBottomColor: '#007AFF' },
  tabIcon: { fontSize: 24, marginBottom: 5 },
  tabText: { fontSize: 14, color: '#666' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15 
  },
  cardIcon: { fontSize: 32, marginRight: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
});