import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme/colors';

const services = [
  { id: '1', name: 'Kubadilisha Oil', price: '25,000', icon: '🛢' },
  { id: '2', name: 'Tire/Bili', price: '15,000', icon: '🛞' },
  { id: '3', name: 'Engine Check', price: '50,000', icon: '🔧' },
];

export default function GarageList({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Toka","Una uhakika unataka kutoka?",[
      {text:"Ghairi",style:"cancel"},
      {text:"Toka",style:"destructive",onPress:async()=>{
        await logout();
        navigation.reset({index:0,routes:[{name:'Login'}]})
      }}
    ])
  };

  return (
    <View style={styles.container}>
      {/* HEADER NA LOGOUT JUU KULIA */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCard} onPress={()=>navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gereji</Text>
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Huduma za Gereji</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.service} 
            onPress={() => navigation.navigate('BookService', { item })}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Kuanzia TSh {item.price}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  // HEADER STYLE - IPHONE ROUNDED
  header: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backCard: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(240,240,240,0.9)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: '#eee',
  },
  logoutCard: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.8)',
  },

  title: { fontSize: 26, fontWeight: '800', paddingHorizontal: 20, marginTop: 20, marginBottom: 16, color: '#111' },
  service: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 18, // ROUNDED KAMA IPHONE
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: '#f2f2f7',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 26 },
  name: { fontSize: 17, fontWeight: '700', color: '#111' },
  price: { fontSize: 13, color: '#666', marginTop: 4, fontWeight: '500' },
});