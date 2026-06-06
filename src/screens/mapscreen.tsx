import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Services: undefined;
  Map: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

interface VehicleType {
  id: string;
  name: string;
  image: any;
  pricePerKm: number;
  baseFare: number;
  icon: string;
}

const VEHICLES: VehicleType[] = [
  {
    id: 'boda',
    name: 'Boda Boda',
    image: require('./assets/boda.png'), // Hakikisha assets ziko /assets/
    pricePerKm: 800,
    baseFare: 1000,
    icon: 'motorcycle'
  },
  {
    id: 'bajaji',
    name: 'Bajaji',
    image: require('./assets/bajaji.png'),
    pricePerKm: 1200,
    baseFare: 1500,
    icon: 'car-sport'
  },
  {
    id: 'taxi',
    name: 'Gari Ndogo',
    image: require('./assets/taxi.png'),
    pricePerKm: 2000,
    baseFare: 2000,
    icon: 'car'
  }
];

export default function mapscreen({ navigation }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VEHICLES[0]);
  const [distanceKm, setDistanceKm] = useState(5.2);
  const [userLocation, setUserLocation] = useState({
    latitude: -6.7924,
    longitude: 39.2083,
  });
  const [destination, setDestination] = useState({
    latitude: -6.8235,
    longitude: 39.2728,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        Alert.alert('Ruhusa', 'Ruhusu location ili tuhesabu nauli sahihi');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const calculateFare = () => {
    return selectedVehicle.baseFare + (selectedVehicle.pricePerKm * distanceKm);
  };

  const totalPrice = calculateFare();
  const estimatedTime = Math.round(distanceKm * 3);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Rudi</Text>
      </TouchableOpacity>

      <   MapView
        provider={PROVIDER_GOOGLE}
        style={styles.Map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={userLocation} title="Upo Hapa" pinColor="blue" />
        <Marker coordinate={destination} title="Unakoenda" pinColor="red" />
      </MapView>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Chagua Usafiri</Text>
        <FlatList
          data={VEHICLES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.vehicleCard, selectedVehicle.id === item.id && styles.selectedCard]}
              onPress={() => setSelectedVehicle(item)}
            >
              <Image source={item.image} style={styles.vehicleImage} />
              <Text style={styles.vehicleName}>{item.name}</Text>
              <Text style={styles.price}>TSh {item.pricePerKm}/km</Text>
              <Text style={styles.baseFare}>+{item.baseFare} kuanzia</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.tripDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Umbali:</Text>
            <Text style={styles.detailValue}>{distanceKm} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Muda wa kusafiri:</Text>
            <Text style={styles.detailValue}>~Dk {estimatedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nauli ya kuanzia:</Text>
            <Text style={styles.detailValue}>TSh {selectedVehicle.baseFare.toLocaleString()}</Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>JUMLA YA NAULI:</Text>
            <Text style={styles.totalPrice}>TSh {totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => Alert.alert('Agizo', `Umeagiza ${selectedVehicle.name} kwa TSh ${totalPrice.toLocaleString()}`)}
        >
          <Text style={styles.bookText}>AGIZA {selectedVehicle.name.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
  },
  backText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  Map: { flex: 1 },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  vehicleCard: {
    width: 120,
    padding: 12,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  selectedCard: { borderColor: '#007AFF', borderWidth: 2.5, backgroundColor: '#E3F2FD' },
  vehicleImage: { width: 70, height: 70, resizeMode: 'contain' },
  vehicleName: { fontSize: 14, fontWeight: '700', marginTop: 8, color: '#333' },
  price: { fontSize: 12, color: '#666', marginTop: 4 },
  baseFare: { fontSize: 10, color: '#999', marginTop: 2 },
  tripDetails: { marginTop: 20, padding: 16, backgroundColor: '#F5F5F5', borderRadius: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#DDD' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  bookButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 14, marginTop: 16, elevation: 3 },
  bookText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
});