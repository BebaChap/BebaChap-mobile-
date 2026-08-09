import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const products = [
  { id: '1', name: 'Mchele 5kg', price: '12,000', image: '🍚' },
  { id: '2', name: 'Mafuta 1L', price: '8,000', image: '🛢' },
  { id: '3', name: 'Sukari 2kg', price: '6,000', image: '🍬' },
];

export default function ShopList({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Toka","Una uhakika unataka kutoka?",[
      {text:"Ghairi",style:"cancel"},
      {
        text:"Toka",
        style:"destructive",
        onPress: async () => {
          await logout();
          // HAKUNA navigation.reset HAPA - logout pekee inatosha
        }
      }
    ])
  };

  return (
    <View style={styles.container}>
      {/* HEADER NA LOGOUT JUU KULIA - IPHONE STYLE */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backCard} onPress={()=>navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Duka</Text>
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      <TextInput style={styles.search} placeholder="Tafuta bidhaa..." placeholderTextColor="#999" />

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.product} 
            onPress={() => navigation.navigate('ProductDetail', { item })}
          >
            <Text style={styles.emoji}>{item.image}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>TSh {item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  topHeader: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15,
    backgroundColor: '#fff', borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backCard: {
    width:44,height:44,borderRadius:22, backgroundColor:'rgba(240,240,240,0.9)',
    alignItems:'center',justifyContent:'center', borderWidth:0.5, borderColor:'#eee',
  },
  logoutCard: {
    width:44,height:44,borderRadius:22,
    backgroundColor:'rgba(255,255,255,0.92)',
    alignItems:'center',justifyContent:'center',
    elevation:6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6,
    borderWidth:0.5,borderColor:'rgba(255,255,255,0.8)',
  },

  search: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    padding: 15, 
    borderRadius: 18,
    marginTop: 16,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.06)',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  product: { 
    flex: 1, 
    backgroundColor: '#fff', 
    margin: 8, 
    padding: 18, 
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8,
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  name: { fontSize: 15, fontWeight: '700', textAlign: 'center', color: '#111' },
  price: { fontSize: 15, color: '#007AFF', fontWeight: '800', marginTop: 6 },
});