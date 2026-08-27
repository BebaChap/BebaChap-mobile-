import React, { useState, useContext } from 'react';
import { View, Image } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { LanguageContext } from '../../contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';

export default function AddProduct({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <View style={{ padding: 20 }}>
      <Input placeholder={t('product_name')} value={name} onChangeText={setName} />
      <Input placeholder={t('price')} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title={t('choose_photo')} onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title={t('next')} onPress={() => {}} />
      <Button title={t('back')} onPress={() => navigation.goBack()} type="outline" />
    </View>
  );
}