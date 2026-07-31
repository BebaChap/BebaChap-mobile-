import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const menu = [
  { id: '1', name: 'Pilau Kuku', price: 12000, desc: 'Pilau tamu na kuku wa kukaanga' },
  { id: '2', name: 'Biryani Nyama', price: 15000, desc: 'Biryani ya nyama na mchuzi' },
  { id: '3', name: 'Chips Kavu', price: 5000, desc: 'Chips kavu na ketchup' },
];

export default function RestaurantDetails({ route, navigation }) {
  const { restaurant } = route.params || {};
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{restaurant?.name || 'Mgahawa'}</Text>
        <Text style={styles.subtitle}>{restaurant?.category} • {restaurant?.time}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={styles.rating}>{restaurant?.rating || '4.8'}</Text>
          <Text style={styles.delivery}> • Delivery {restaurant?.deliveryFee || '1,500'}</Text>
        </View>
      </View>

      <FlatList
        data={menu}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDesc}>{item.desc}</Text>
              <Text style={styles.foodPrice}>TZS {item.price.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart', { cart, restaurant })}
        >
          <Text style={styles.cartText}>Tazama Cart ({cart.length}) - TZS {cart.reduce((s,i)=>s+i.price,0).toLocaleString()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.black },
  subtitle: { fontSize: 13, color: COLORS.textGray, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { marginLeft: 4, fontSize: 12, fontWeight: '700', color: COLORS.black },
  delivery: { fontSize: 12, color: COLORS.textGray, marginLeft: 4 },
  foodCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  foodName: { fontSize: 15, fontWeight: 'bold', color: COLORS.black },
  foodDesc: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  foodPrice: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginTop: 6 },
  addBtn: { backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cartBtn: { backgroundColor: COLORS.primary, margin: 16, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cartText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});