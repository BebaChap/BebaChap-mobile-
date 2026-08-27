import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const { t } = useLanguage();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('ride');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007aff" /><Text style={{marginTop:10}}>{t('locating')}</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location || {
          latitude: -6.7924, // Dar es Salaam
          longitude: 39.2083,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {location && <Marker coordinate={location} title={t('your_location')} />}
      </MapView>

      {/* TOP SEARCH BAR */}
      <View style={styles.topContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder={t('where_are_you_going')}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
          <TouchableOpacity><Ionicons name="options" size={20} color="#007aff" /></TouchableOpacity>
        </View>
        
        <View style={styles.chipsRow}>
          <TouchableOpacity style={[styles.chip, selectedService==='ride' && styles.chipActive]} onPress={()=>setSelectedService('ride')}>
            <Text style={[styles.chipText, selectedService==='ride' && styles.chipTextActive]}>🏍 {t('boda')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, selectedService==='spare' && styles.chipActive]} onPress={()=>setSelectedService('spare')}>
            <Text style={[styles.chipText, selectedService==='spare' && styles.chipTextActive]}>🔧 {t('word_spare')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, selectedService==='garage' && styles.chipActive]} onPress={()=>setSelectedService('garage')}>
            <Text style={[styles.chipText, selectedService==='garage' && styles.chipTextActive]}>🏪 {t('garages')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MY LOCATION BUTTON */}
      <TouchableOpacity style={styles.myLocationBtn}>
        <Ionicons name="locate" size={24} color="#007aff" />
      </TouchableOpacity>

      {/* BOTTOM SHEET */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>{t('welcome_bebachap')}</Text>
        <Text style={styles.sheetSub}>{t('choose_service')}</Text>

        <View style={styles.serviceList}>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}><Text>📍</Text></View>
            <View style={{flex:1}}><Text style={styles.serviceTitle}>{t('nyumbani')}</Text><Text style={styles.serviceDesc}>{t('current_location')}</Text></View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}><Text>🛒</Text></View>
            <View style={{flex:1}}><Text style={styles.serviceTitle}>{t('nearby_shop')}</Text><Text style={styles.serviceDesc}>{t('spare_open')}</Text></View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={()=>navigation.navigate('CustomerApp')}>
          <Text style={styles.mainBtnText}>{t('next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  center:{flex:1, justifyContent:'center', alignItems:'center'},
  map:{width:'100%', height:'100%'},
  topContainer:{position:'absolute', top:50, left:15, right:15, zIndex:10},
  searchBar:{flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:16, paddingHorizontal:15, paddingVertical:4, elevation:5, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:10},
  searchInput:{flex:1, padding:14, fontSize:16, marginLeft:8},
  chipsRow:{flexDirection:'row', marginTop:12, gap:8},
  chip:{backgroundColor:'#fff', paddingHorizontal:14, paddingVertical:8, borderRadius:20, elevation:2},
  chipActive:{backgroundColor:'#007aff'},
  chipText:{fontSize:13, fontWeight:'600', color:'#333'},
  chipTextActive:{color:'#fff'},
  myLocationBtn:{position:'absolute', bottom: height*0.42, right:15, backgroundColor:'#fff', width:48, height:48, borderRadius:24, justifyContent:'center', alignItems:'center', elevation:5},
  bottomSheet:{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, minHeight: height*0.38, elevation:20},
  handle:{width:40, height:5, backgroundColor:'#ddd', borderRadius:3, alignSelf:'center', marginBottom:15},
  sheetTitle:{fontSize:20, fontWeight:'bold', color:'#1a1a1a'},
  sheetSub:{fontSize:14, color:'#666', marginTop:4, marginBottom:20},
  serviceList:{gap:12},
  serviceItem:{flexDirection:'row', alignItems:'center', backgroundColor:'#f9f9f9', padding:14, borderRadius:14},
  serviceIcon:{width:40, height:40, borderRadius:20, backgroundColor:'#fff', justifyContent:'center', alignItems:'center', marginRight:12},
  serviceTitle:{fontWeight:'700', fontSize:15}, serviceDesc:{fontSize:12, color:'#666', marginTop:2},
  badge:{backgroundColor:'#00c853', paddingHorizontal:8, paddingVertical:3, borderRadius:10}, badgeText:{color:'#fff', fontSize:10, fontWeight:'bold'},
  mainBtn:{backgroundColor:'#007aff', padding:16, borderRadius:14, marginTop:20, alignItems:'center'},
  mainBtnText:{color:'#fff', fontWeight:'bold', fontSize:16}
});