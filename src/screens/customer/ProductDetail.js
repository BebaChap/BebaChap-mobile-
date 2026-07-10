import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ProductDetail({ route, navigation }) {
  const { item } = route?.params || {};

  const addToCart = () => {
    Alert.alert('Imeongezwa', `${item?.name} imeongezwa kwenye kikapu`);
    navigation.navigate('Cart');
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Bidhaa haijapatikana</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{item.image}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>TSh {item.price}</Text>
      <Text style={styles.desc}>Bidhaa bora kutoka dukani kwetu. Ubora wa hali ya juu.</Text>
      <TouchableOpacity style={styles.button} onPress={addToCart}>
        <Text style={styles.buttonText}>🛒 Ongeza Kikapuni</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
    paddingTop: 60, 
    alignItems: 'center' 
  },
  emoji: { fontSize: 120, marginBottom: 20 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 24, color: '#007AFF', fontWeight: 'bold', marginBottom: 20 },
  desc: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 18, 
    borderRadius: 8, 
    width: '100%' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
});