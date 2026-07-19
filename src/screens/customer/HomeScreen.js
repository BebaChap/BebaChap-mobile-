import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import SafariCard from '../../components/SafariCard';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('usafiri');
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Una uhakika unataka kutoka?', [
      { text: 'Sitisha', style: 'cancel' },
      { text: 'Toka', style: 'destructive', onPress: () => logout() },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Mwanzo',
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: 'hsl(137, 28%, 95%)',
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Ionicons name="log-out-outline" size={40} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  const tabs = [
    { key: 'usafiri', label: 'Usafiri', icon: require('../../../assets/icons/boda.png') },
    { key: 'duka', label: 'Duka', icon: require('../../../assets/icons/shop.png') },
    { key: 'gereji', label: 'Gereji', icon: require('../../../assets/icons/garage.png') },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View>
            <Text style={styles.greeting}>Habari, {user?.name?.split(' ')[0] || 'Juma'} 👋</Text>
            <View style={styles.locationRow}>
             <Ionicons name="location" size={14} color="#fff" />
              <Text style={styles.locationText}>Tabata, Dar es Salaam</Text>
            </View>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('Map')} style={styles.mapBtn}>
          <Ionicons name="map" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Tafuta usafiri, bidhaa, fundi..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Image source={tab.icon} style={[styles.tabIconImg, activeTab === tab.key && {tintColor: COLORS.primary}]} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'usafiri' && (
          <View>
            <SafariCard style={styles.banner}>
              <View style={{flex:1}}>
                <Text style={styles.bannerTitle}>Pata Boda Haraka!</Text>
                <Text style={styles.bannerSub}>Dereva wa karibu ndani ya dakika 3</Text>
                <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('RequestRide')}>
                  <Text style={styles.bannerBtnText}>Agiza Sasa</Text>
                </TouchableOpacity>
              </View>
              <Image source={require('../../../assets/icons/boda.png')} style={styles.bannerImage} />
            </SafariCard>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequestRide')}>
              <Image source={require('../../../assets/icons/boda.png')} style={styles.cardIconImg} />
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>Agiza Usafiri</Text>
                <Text style={styles.cardDesc}>Boda, bajaji, teksi</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TripHistory')}>
              <View style={[styles.cardIconBox,{backgroundColor:'#e3f2fd'}]}>
                <Ionicons name="time-outline" size={22} color={COLORS.primary} />
              </View>
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>Safari Zangu</Text>
                <Text style={styles.cardDesc}>Historia na risiti</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'duka' && (
          <>
            <SafariCard style={styles.banner2}>
              <Image source={require('../../../assets/icons/shop.png')} style={styles.bannerImageSmall} />
              <View style={{flex:1, marginLeft:12}}>
                <Text style={styles.bannerTitle}>Duka la Spare</Text>
                <Text style={styles.bannerSub}>Nunua oil, tairi, betri na zaidi</Text>
              </View>
            </SafariCard>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Shop')}>
              <Image source={require('../../../assets/icons/shop.png')} style={styles.cardIconImg} />
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>Nenda Dukani</Text>
                <Text style={styles.cardDesc}>Bidhaa halisi na bei nafuu</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'gereji' && (
          <>
            <SafariCard style={styles.banner2}>
              <Image source={require('../../../assets/icons/garage.png')} style={styles.bannerImageSmall} />
              <View style={{flex:1, marginLeft:12}}>
                <Text style={styles.bannerTitle}>Fundi wa Karibu</Text>
                <Text style={styles.bannerSub}>Pata huduma ya uhakika</Text>
              </View>
            </SafariCard>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Garage')}>
              <Image source={require('../../../assets/icons/garage.png')} style={styles.cardIconImg} />
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>Pata Fundi</Text>
                <Text style={styles.cardDesc}>Oil, tire, engine check</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 20, borderBottomLeftRadius:24, borderBottomRightRadius:24 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  locationRow:{flexDirection:'row', alignItems:'center', marginTop:6},
  locationIcon:{width:14, height:14, tintColor:'#fff', marginRight:4},
  locationText:{color:'#e0e0e0', fontSize:13},
  mapBtn:{backgroundColor:'rgba(255,255,255,0.2)', width:40, height:40, borderRadius:12, justifyContent:'center', alignItems:'center'},
  mapIcon:{width:22, height:22, tintColor:'#fff'},
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, marginTop:18, height:50 },
  searchIconImg: { width:18, height:18, tintColor: COLORS.textLight },
  searchInput: { flex: 1, marginLeft:10, fontSize: 15, color: COLORS.black },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal:16, marginTop:-20, borderRadius:14, padding:6, elevation:4, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius:10 },
  activeTab: { backgroundColor: '#e3f2fd' },
  tabIconImg: { width:26, height:26, tintColor: COLORS.textLight, marginBottom:4 },
  tabText: { fontSize: 12, color: COLORS.textGray, fontWeight:'600' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  banner:{flexDirection:'row', alignItems:'center', marginTop:10, borderLeftWidth:4, borderLeftColor: COLORS.primary},
  banner2:{flexDirection:'row', alignItems:'center', marginTop:10},
  bannerTitle:{fontSize:16, fontWeight:'800', color: COLORS.black},
  bannerSub:{fontSize:12, color: COLORS.textGray, marginTop:2},
  bannerBtn:{backgroundColor:COLORS.black, alignSelf:'flex-start', paddingHorizontal:14, paddingVertical:6, borderRadius:20, marginTop:10},
  bannerBtnText:{color:'#fff', fontSize:12, fontWeight:'700'},
  bannerImage:{width:70, height:70, resizeMode:'contain'},
  bannerImageSmall:{width:44, height:44, resizeMode:'contain'},
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth:1, borderColor: COLORS.border },
  cardIconImg: { width:32, height:32, resizeMode:'contain', marginRight: 14 },
  cardIconBox:{width:36, height:36, borderRadius:10, justifyContent:'center', alignItems:'center', marginRight:14},
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  cardDesc: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
});