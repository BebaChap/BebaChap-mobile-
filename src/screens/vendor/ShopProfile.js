import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ShopProfile({ navigation }) {
  const { t } = useLanguage();
  const [shopName, setShopName] = useState('Juma Store');
  const [location, setLocation] = useState('Sinza, Dar es Salaam');
  const [hours, setHours] = useState('8:00 AM - 9:00 PM');
  const [phone, setPhone] = useState('+255712345678');
  const [desc, setDesc] = useState('Tunauza bidhaa bora za chakula kwa bei nafuu');
  const [vendorType, setVendorType] = useState('shop');
  const [shopImage, setShopImage] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('permission'), t('allow_photo_permission'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setShopImage(result.assets[0].uri);
    }
  };

  const saveProfile = () => {
    if (!shopName ||!location ||!phone) {
      Alert.alert(t('error'), t('fill_required_fields'));
      return;
    }

    Alert.alert(
      t('saved'),
      vendorType === 'restaurant'? t('restaurant_profile_saved') : t('shop_profile_saved'),
      [
        { text: 'OK', onPress: () => navigation?.goBack() }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('shop_profile')}</Text>

      <View style={styles.photoBox}>
        {shopImage? (
          <Image source={{ uri: shopImage }} style={styles.shopImage} />
        ) : (
          <Text style={styles.photoIcon}>{vendorType === 'restaurant'? '🍽' : '🏪'}</Text>
        )}
        <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
          <Text style={styles.changePhotoText}>{shopImage? t('change_photo') : t('choose_photo')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t('business_type')}</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeCard, vendorType === 'shop' && styles.typeCardActive]}
          onPress={() => setVendorType('shop')}
        >
          <Text style={styles.typeIcon}>🏪</Text>
          <Text style={[styles.typeText, vendorType === 'shop' && styles.typeTextActive]}>{t('shop_supermarket')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeCard, vendorType === 'restaurant' && styles.typeCardActive]}
          onPress={() => setVendorType('restaurant')}
        >
          <Text style={styles.typeIcon}>🍽</Text>
          <Text style={[styles.typeText, vendorType === 'restaurant' && styles.typeTextActive]}>{t('restaurant_fastfood')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t('business_name')}</Text>
      <TextInput
        style={styles.input}
        value={shopName}
        onChangeText={setShopName}
        placeholder={vendorType === 'restaurant'? t('ex_restaurant_name') : t('ex_shop_name')}
      />

      <Text style={styles.label}>{t('location')}</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder={t('location')} />

      <Text style={styles.label}>{t('working_hours')}</Text>
      <TextInput style={styles.input} value={hours} onChangeText={setHours} placeholder={t('working_hours')} />

      <Text style={styles.label}>{t('phone_number')}</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder={t('phone_number')} />

      <Text style={styles.label}>{vendorType === 'restaurant'? t('menu_description') : t('description')}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={4}
        placeholder={vendorType === 'restaurant'? t('menu_desc_placeholder') : t('shop_desc_placeholder')}
      />

      <TouchableOpacity style={[styles.saveBtn, vendorType === 'restaurant' && {backgroundColor: '#FF6B00'}]} onPress={saveProfile}>
        <Text style={styles.saveText}>{t('save_changes')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 25 },
  photoBox: { alignItems: 'center', marginBottom: 30 },
  photoIcon: { fontSize: 80, marginBottom: 15 },
  shopImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  changePhotoBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  changePhotoText: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8, paddingHorizontal: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, marginHorizontal: 20, backgroundColor: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  typeContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 5 },
  typeCard: { flex: 1, borderWidth: 2, borderColor: '#ddd', borderRadius: 12, padding: 15, alignItems: 'center', backgroundColor: '#f9f9f9' },
  typeCardActive: { borderColor: '#007AFF', backgroundColor: '#E8F0FE' },
  typeIcon: { fontSize: 30, marginBottom: 6 },
  typeText: { fontSize: 13, fontWeight: '600', textAlign: 'center', color: '#666' },
  typeTextActive: { color: '#007AFF' },
  saveBtn: { backgroundColor: '#007AFF', margin: 20, padding: 18, borderRadius: 8, marginTop: 30 },
  saveText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});