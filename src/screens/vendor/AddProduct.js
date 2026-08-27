import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AddProduct({ route, navigation }) {
  const { t } = useLanguage();
  const vendorType = route?.params?.vendorType || 'shop';
  const editingProduct = route?.params?.product;

  const [name, setName] = useState(editingProduct?.name || '');
  const [price, setPrice] = useState(editingProduct?.price?.toString() || '');
  const [stock, setStock] = useState(editingProduct?.stock?.toString() || '');
  const [image, setImage] = useState(editingProduct?.imageUri || null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      Alert.alert(t('permission'), t('gallery_permission'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name ||!price) {
      Alert.alert(t('fill_fields'), t('name_price_required'));
      return;
    }
    console.log({ name, price, stock, image, vendorType });
    Alert.alert(t('saved'), t('item_added', { name }));
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage} activeOpacity={0.8}>
        {image? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📸</Text>
            <Text style={styles.placeholderText}>{t('tap_add_photo')}</Text>
            <Text style={styles.subText}>{vendorType === 'restaurant'? t('word_food') : t('word_product')}</Text>
          </View>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity onPress={pickImage} style={styles.changeBtn}>
          <Text style={styles.changeText}>{t('change_photo')}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>{vendorType === 'restaurant'? t('food_name') : t('product_name')}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Mf: Mchele 5kg" />

      <Text style={styles.label}>{t('price')} (TSh)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="12000" />

      {vendorType!== 'restaurant' && (
        <>
          <Text style={styles.label}>Stock</Text>
          <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="25" />
        </>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>{editingProduct? t('edit') : t('save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  imageBox: { width: '100%', height: 200, backgroundColor: '#f2f2f2', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  icon: { fontSize: 40, marginBottom: 8 },
  placeholderText: { fontSize: 16, fontWeight: '600', color: '#333' },
  subText: { fontSize: 13, color: '#888', marginTop: 2 },
  changeBtn: { alignSelf: 'center', marginBottom: 15 },
  changeText: { color: '#007AFF', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});