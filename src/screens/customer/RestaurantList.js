import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import SafariCard from '../../components/SafariCard';

const restaurants = [
  { id: '1', name: 'Lina Restaurant', category: 'Pilau', rating: 4.8, time: '20-30 min', deliveryFee: '1,500', image: require('../../../assets/icons/shop.png'), isOpen: true },
  { id: '2', name: 'Tabata Fast Food', category: 'Biryani', rating: 4.6, time: '15-25 min', deliveryFee: '1,000', image: require('../../../assets/icons/shop.png'), isOpen: true },
  { id: '3', name: 'Kwetu Kitchen', category: 'Chips', rating: 4.5, time: '10-20 min', deliveryFee: 'Free', image: require('../../../assets/icons/shop.png'), isOpen: false },
];

const categories = ['Yote', 'Pilau', 'Biryani', 'Chips', 'Kuku', 'Juice'];

export default function RestaurantList({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Yote');

  const filtered = restaurants.filter(r => {
    const matchCat = activeCat === 'Yote' || r.category === activeCat;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Tafuta mgahawa, chakula..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* Categories */}
      <View style={{height: 50, marginTop:12}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item}
          contentContainerStyle={{paddingHorizontal:16, gap:8}}
          renderItem={({item}) => (
            <TouchableOpacity 
              onPress={()=>setActiveCat(item)}
              style={[styles.catChip, activeCat===item && styles.activeChip]}
            >
              <Text style={[styles.catText, activeCat===item && styles.activeCatText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding:16}}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={()=>navigation.navigate('RestaurantDetails', { restaurant: item })}
          >
            <SafariCard style={styles.cardInner}>
              <Image source={item.image} style={styles.cardImg} />
              <View style={{flex:1, marginLeft:12}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.statusDot}>
                    <View style={[styles.dot, {backgroundColor: item.isOpen ? '#2ECC71' : '#999'}]} />
                    <Text style={styles.statusText}>{item.isOpen ? 'Wazi' : 'Imefungwa'}</Text>
                  </View>
                </View>
                <Text style={styles.category}>{item.category} • {item.time}</Text>
                <View style={styles.footer}>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={12} color="#FFB800" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                  <Text style={styles.delivery}>Delivery: {item.deliveryFee}</Text>
                </View>
              </View>
            </SafariCard>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: COLORS.background },
  searchBox: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:14, paddingHorizontal:14, height:48, marginHorizontal:16, marginTop:16, borderWidth:1, borderColor: COLORS.border },
  searchInput: { flex:1, marginLeft:10, fontSize:15, color: COLORS.black },
  catChip: { backgroundColor:'#fff', paddingHorizontal:16, height:34, borderRadius:20, justifyContent:'center', borderWidth:1, borderColor: COLORS.border },
  activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize:13, fontWeight:'600', color: COLORS.textGray },
  activeCatText: { color:'#fff' },
  card: { marginBottom:12 },
  cardInner: { flexDirection:'row', alignItems:'center', padding:12 },
  cardImg: { width:60, height:60, borderRadius:12, backgroundColor:'#FFF3E0', resizeMode:'contain' },
  name: { fontSize:15, fontWeight:'bold', color: COLORS.black },
  category: { fontSize:12, color: COLORS.textGray, marginTop:2 },
  footer: { flexDirection:'row', alignItems:'center', marginTop:6, gap:10 },
  ratingBox: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFF8E1', paddingHorizontal:6, paddingVertical:2, borderRadius:10 },
  rating: { marginLeft:4, fontSize:11, fontWeight:'700' },
  delivery: { fontSize:11, color: COLORS.textGray },
  statusDot: { flexDirection:'row', alignItems:'center', gap:4 },
  dot: { width:6, height:6, borderRadius:3 },
  statusText: { fontSize:10, color: COLORS.textGray }
});