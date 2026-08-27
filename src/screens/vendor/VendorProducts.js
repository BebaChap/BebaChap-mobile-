import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../contexts/LanguageContext';

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Mchele 5kg', price: 12000, stock: 25, image: '🍚', active: true, type: 'shop' },
  { id: '2', name: 'Mafuta 1L', price: 8000, stock: 0, image: '🛢', active: false, type: 'shop' },
  { id: '3', name: 'Sukari 2kg', price: 6000, stock: 15, image: '🍬', active: true, type: 'shop' },
  // Mfano wa restaurant - itaonekana kama vendorType ni restaurant
  { id: '4', name: 'Chips Kavu', price: 5000, stock: 50, prepTime: '15 min', category: 'Chakula', image: '🍟', active: true, type: 'food' },
];

export default function ManageProducts({ route }) {
  const navigation = useNavigation();
  const { t } = useLanguage();
  // Badilisha hapa 'shop' kuwa 'restaurant' ukitaka kuona view ya restaurant
  // Baadaye hii itatoka kwenye ShopProfile.js: route.params.vendorType
  const vendorType = route?.params?.vendorType || 'shop';
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Logic yako ya awali - Sijagusa kabisa
  const toggleActive = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deleteProduct = (id) => {
    Alert.alert(t('delete'), t('logout_confirm'), [
      { text: t('cancel') },
      { text: t('delete'), style: 'destructive', onPress: () => setProducts(products.filter(p => p.id !== id)) },
    ]);
  };

  // Filter kulingana na aina ya vendor
  const filteredProducts = products.filter(p => {
    if (vendorType === 'restaurant') return p.type === 'food';
    return p.type === 'shop';
  });

  // Kama hakuna product kwa type hiyo, onyesha zote kwa test
  const dataToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{vendorType === 'restaurant' ? t('food_menu') : t('my_products')}</Text>
          <Text style={styles.subtitle}>{dataToShow.length} {vendorType === 'restaurant' ? t('word_food') : t('word_product')}</Text>
        </View>
        <TouchableOpacity style={[styles.addBtn, vendorType === 'restaurant' && { backgroundColor: '#FF6B00' }]} onPress={() => navigation.navigate('AddProduct', { vendorType })}>
          <Text style={styles.addText}>+ {t('add')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productIcon}>{item.image}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={[styles.productPrice, vendorType === 'restaurant' && { color: '#FF6B00' }]}>
                TSh {item.price.toLocaleString()}
              </Text>
              
              {item.type === 'food' ? (
                <View style={styles.foodMeta}>
                  {item.category && <Text style={styles.badge}>{item.category}</Text>}
                  {item.prepTime && <Text style={styles.prepTime}>⏱ {item.prepTime}</Text>}
                </View>
              ) : (
                <Text style={[styles.productStock, item.stock === 0 && styles.outOfStock]}>
                  Stock: {item.stock} {item.stock === 0 ? `(${t('out_of_stock')})` : ''}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleActive(item.id)}>
                <Text style={[styles.toggle, item.active && styles.toggleActive]}>
                  {item.active ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddProduct', { product: item, vendorType })}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  addBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  productIcon: { fontSize: 38, marginRight: 15 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  productPrice: { fontSize: 15, color: '#007AFF', fontWeight: '600' },
  productStock: { fontSize: 13, color: '#666', marginTop: 4 },
  foodMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  badge: { fontSize: 11, backgroundColor: '#FFF0E5', color: '#FF6B00', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontWeight: 'bold', overflow: 'hidden' },
  prepTime: { fontSize: 12, color: '#888' },
  outOfStock: { color: '#F44336', fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  toggle: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, backgroundColor: '#eee', color: '#888', minWidth: 35, textAlign: 'center' },
  toggleActive: { backgroundColor: '#4CAF50', color: '#fff' },
  edit: { fontSize: 18 },
  delete: { fontSize: 18 },
});