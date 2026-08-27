import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import SafariCard from '../../components/SafariCard';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const restaurants = [
  { id: '1', name: 'Lina Restaurant', category: 'Pilau', rating: 4.8, time: '20-30 min', deliveryFee: '1,500', image: require('../../../assets/icons/shop.png'), isOpen: true },
  { id: '2', name: 'Tabata Fast Food', category: 'Biryani', rating: 4.6, time: '15-25 min', deliveryFee: '1,000', image: require('../../../assets/icons/shop.png'), isOpen: true },
  { id: '3', name: 'Kwetu Kitchen', category: 'Chips', rating: 4.5, time: '10-20 min', deliveryFee: 'Free', image: require('../../../assets/icons/shop.png'), isOpen: false },
];

const categories = ['Yote', 'Pilau', 'Biryani', 'Chips', 'Kuku', 'Juice'];

export default function RestaurantList({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Yote');
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    Alert.alert(t('logout'),t('logout_confirm'),[
      {text:t('cancel'),style:"cancel"},
      {text:t('logout'),style:"destructive",onPress:async()=>{
        await logout();
        navigation.reset({index:0,routes:[{name:'Login'}]})
      }}
    ])
  };

  const filtered = restaurants.filter(r => {
    const matchCat = activeCat === 'Yote' || r.category === activeCat;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backCard} onPress={()=>navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('restaurant_list')}</Text>
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder={t('search_food')}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      <View style={{height: 50, marginTop:12}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item}
          contentContainerStyle={{paddingHorizontal:16, gap:10}}
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

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding:16, paddingBottom: 30}}
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
  container: { flex:1, backgroundColor: '#f8f9fa' },
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
    width:44,height:44,borderRadius:22, backgroundColor:'rgba(255,255,255,0.92)',
    alignItems:'center',justifyContent:'center', elevation:6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6,
    borderWidth:0.5,borderColor:'rgba(255,255,255,0.8)',
  },
  searchBox: {
    flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:20,
    paddingHorizontal:16, height:50, marginHorizontal:16, marginTop:16,
    borderWidth:0.5, borderColor: 'rgba(0,0,0,0.06)', elevation:3,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8,
  },
  searchInput: { flex:1, marginLeft:10, fontSize:14, color: COLORS.black, fontWeight:'500' },
  catChip: {
    backgroundColor:'rgba(255,255,255,0.9)', paddingHorizontal:18, height:36, borderRadius:18,
    justifyContent:'center', borderWidth:0.8, borderColor: 'rgba(0,0,0,0.06)',
    elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:4,
  },
  activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, elevation:4 },
  catText: { fontSize:13, fontWeight:'700', color: COLORS.textGray },
  activeCatText: { color:'#fff' },
  card: { marginBottom:12 },
  cardInner: { flexDirection:'row', alignItems:'center', padding:14, borderRadius: 18 },
  cardImg: { width:62, height:62, borderRadius:16, backgroundColor:'#FFF3E0', resizeMode:'contain' },
  name: { fontSize:15, fontWeight:'800', color: COLORS.black },
  category: { fontSize:12, color: COLORS.textGray, marginTop:3, fontWeight:'500' },
  footer: { flexDirection:'row', alignItems:'center', marginTop:8, gap:10 },
  ratingBox: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFF8E1', paddingHorizontal:8, paddingVertical:3, borderRadius:12 },
  rating: { marginLeft:4, fontSize:11, fontWeight:'700' },
  delivery: { fontSize:11, color: COLORS.textGray, fontWeight:'500' },
  statusDot: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'#f2f2f7', paddingHorizontal:8, paddingVertical:3, borderRadius:12 },
  dot: { width:6, height:6, borderRadius:3 },
  statusText: { fontSize:10, color: COLORS.textGray, fontWeight:'600' }
});